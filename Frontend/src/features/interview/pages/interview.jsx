import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router';
import '../style/interview.scss';
import { useInterview } from '../hooks/useInterview';
/* Animated accordion that measures real content height */
function Accordion({ open, children }) {
  const ref = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) setHeight(ref.current.scrollHeight);
  }, [children]);

  return (
    <div
      className="accordion-wrap"
      style={{
        maxHeight: open ? height + 'px' : '0px',
        overflow: 'hidden',
        transition: 'max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <div ref={ref} className="question-detail">
        {children}
      </div>
    </div>
  );
}


const severityColors = {
  high: '#D11149',
  medium: '#e87c2b',
  low: '#00a69c',
};

const Interview = () => {
  const { interviewId } = useParams();
  const [activeSection, setActiveSection] = useState('technical');
  const [expandedId, setExpandedId] = useState(null);
  const [contentKey, setContentKey] = useState(0);
  const cardRefs = useRef({});
  const {report, getReportById, loading, generateResumePDF} = useInterview();
  
  // Fetch report from backend when page loads or interviewId changes
  useEffect(() => {
    if (interviewId && !report) {
      getReportById(interviewId).catch(error => {
        console.error("Failed to fetch report:", error);
      });
    }
  }, [interviewId]);
  
  const sections = report ? [
    { key: 'technical', label: 'Technical Questions', icon: '⟨ ⟩', count: report.technicalQuestions?.length || 0 },
    { key: 'behavioral', label: 'Behavioral Questions', icon: '💬', count: report.behavioralQuestions?.length || 0 },
    { key: 'roadmap', label: 'Road Map', icon: '✈️', count: report.preparationPlan?.length || 0 },
  ] : [];
  const handleSectionChange = (key) => {
    setContentKey((k) => k + 1);
    setActiveSection(key);
    setExpandedId(null);
  };

  const renderContent = () => {
    if (!report) {
      return (
        <div style={{padding: '2rem', textAlign: 'center'}}>
          <div>{loading ? 'Fetching report...' : 'Loading report...'}</div>
        </div>
      );
    }
    
    if (activeSection === 'roadmap') {
      return (
        <div className="questions-list">
          {report.preparationPlan.map((plan, index) => (
            <article key={index} className="question-card roadmap-card">
              <div className="question-title">
                <span className="q-badge">Day {plan.day}</span>
                <h4>{plan.focus}</h4>
              </div>
              <ul className="task-list">
                {plan.tasks.map((task, i) => (
                  <li key={i}>{task}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      );
    }

    const questions =
      activeSection === 'technical' ? report.technicalQuestions : report.behavioralQuestions;

    return (
      <div className="questions-list">
        {questions.map((q, index) => (
          <article
            key={index}
            ref={(el) => { cardRefs.current[index] = el; }}
            className={`question-card ${expandedId === index ? 'open' : ''}`}
            onClick={() => {
              const isOpening = expandedId !== index;
              setExpandedId(isOpening ? index : null);
              if (isOpening) {
                // wait for accordion to start expanding, then scroll card into view
                setTimeout(() => {
                  cardRefs.current[index]?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                  });
                }, 50);
              }
            }}
          >
            <div className="question-title">
              <span className="q-badge">Q{index + 1}</span>
              <h4>{q.question}</h4>
              <span className={`arrow ${expandedId === index ? 'open' : ''}`}>▾</span>
            </div>
            <Accordion open={expandedId === index}>
              <div className="detail-section intention">
                <strong>🎯 Intention</strong>
                <p>{q.intention}</p>
              </div>
              <div className="detail-section answer">
                <strong>💡 Suggested Answer</strong>
                <p>{q.answer}</p>
              </div>
            </Accordion>
          </article>
        ))}
      </div>
    );
  };

  const activeSection_ = sections.find((s) => s.key === activeSection);

  return (
    <main className="interview-home">
      <div className="interview-grid">
        {/* LEFT — Sidebar */}
        <aside className="survey-sidebar glass-panel">
          <div className="sidebar-top">
            <h3 className="panel-label">Sections</h3>
            <ul>
              {sections.map((section) => (
                <li
                  key={section.key}
                  onClick={() => handleSectionChange(section.key)}
                  className={activeSection === section.key ? 'active' : ''}
                >
                  <span className="nav-icon">{section.icon}</span>
                  <span className="nav-label">{section.label}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="sidebar-bottom">
            <button 
              className="generate-resume-btn"
              onClick={() => generateResumePDF(interviewId)}
              disabled={loading}
            >
              <span className="btn-icon">✦</span>
              {loading ? 'Generating...' : 'AI Generated Resume'}
            </button>
          </div>
        </aside>

        {/* CENTER — Main content */}
        <section className="survey-main glass-panel">
          <header className="survey-header">
            <div className="header-left">
              <h2>{activeSection_?.label}</h2>
              <span className="count-badge">
                {activeSection_?.count} {activeSection === 'roadmap' ? 'days' : 'questions'}
              </span>
            </div>
          </header>
          <div className="content-scroll">
            <div key={contentKey} className="content-fade">
              {renderContent()}
            </div>
          </div>
        </section>

        {/* RIGHT — Match score + skill gaps */}
        <aside className="survey-sidepanel glass-panel">
          <div className="panel-card match-card">
            <h3 className="panel-label">Match Score</h3>
            <div className="score-ring-wrapper">
              <div
                className="score-ring"
                style={{
                  background: `conic-gradient(#D11149 0 ${report?.matchScore || 0}%, rgba(255,255,255,0.08) ${report?.matchScore || 0}% 100%)`,
                }}
              >
                <div className="ring-inner">
                  <span className="score-number">
                    {report?.matchScore || 0}
                    <em>%</em>
                  </span>
                </div>
              </div>
            </div>
            <p className="score-label">Strong match for this role</p>
          </div>

          <div className="panel-card gaps-card">
            <h3 className="panel-label">Skill Gaps</h3>
            <ul className="gap-list">
              {report?.skillGap?.map((gap, i) => (
                <li
                  key={i}
                  className={`gap-item ${gap.severity}`}
                  style={{ '--gap-color': severityColors[gap.severity] || '#888' }}
                >
                  {gap.skill}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </main>
  );
};

export default Interview;