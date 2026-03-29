import { useContext } from "react";
import { InterviewContext } from "../interview.context";
import { generateInterviewReport, getInterviewReportById, getAllInterviewReports } from "../services/interview.api";

export const useInterview = () => {
    const context= useContext(InterviewContext);
    if(!context){
        throw new Error("useInterview must be used within InterviewProvider");
    }
    const {loading,setLoading,report,setReport,reports,setReports} = context;

    const generateReport = async ({selfDescription,jobDescription,resumeFile}) => {
        setLoading(true);
        try {
            console.log("useInterview: Calling generateInterviewReport");
            const response = await generateInterviewReport({selfDescription,jobDescription,resumeFile});
            console.log("useInterview: Report generated:", response);
            setReport(response.data || response);
            return response.data || response;
        } catch (error) {
            console.error("useInterview: Error generating report:", error);
            setReport(null);
            throw error;
        } finally {
            setLoading(false);
        }  
    }

        const getReportById = async (id) => {
            setLoading(true);
            try {
                const response = await getInterviewReportById(id);
                setReport(response.data);
                return response.data;
            } catch (error) {
                console.error("Error getting report:", error);
                throw error;
            } finally {
                setLoading(false);
            }
        }

        const getAllReports = async () => {
            setLoading(true);
            try {
                const response = await getAllInterviewReports();
                setReports(response.data);
                return response.data;
            } catch (error) {
                console.error("Error getting reports:", error);
                throw error;
            } finally {
                setLoading(false);
            }
        }
    
    return {
        loading,
        setLoading,
        report,
        setReport,
        reports,
        setReports,
        generateReport,
        getReportById,
        getAllReports
    }
}
