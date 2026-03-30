import axios from "axios";

const api=axios.create({
    baseURL:"/api",
    withCredentials: true  // This sends cookies with requests
})

/*
*@description:Generate interview report
*/

export const generateInterviewReport = async ({resume,selfDescription,jobDescription,resumeFile}) => {
   const formData = new FormData();
   formData.append("resume",resumeFile);
   formData.append("selfDescription",selfDescription);
   formData.append("jobDescription",jobDescription);
   try {
       console.log("generateInterviewReport - Sending form data with:", {
           hasFile: !!resumeFile,
           fileName: resumeFile?.name,
           selfDescriptionLen: selfDescription?.length,
           jobDescriptionLen: jobDescription?.length
       });
       
       const response = await api.post("/interview/",formData, {
           headers:{
               // Don't set Content-Type - axios will auto-set with correct boundary
           },
           withCredentials: true
       });
       console.log("generateInterviewReport - Response:", response.data);
       return response.data;
   } catch (error) {
       console.error("generateInterviewReport error response:", error.response?.data);
       console.error("generateInterviewReport error status:", error.response?.status);
       console.error("generateInterviewReport error message:", error.message);
       throw error;
   }
}

/*
*@description:Get interview report by id
*/

export const getInterviewReportById = async (id) => {
    const response = await api.get(`/interview/${id}`);
    return response.data;
}

/*
*@description:Get all interview reports
*/

export const getAllInterviewReports = async () => {
    const response = await api.get("/interview/");
    return response.data;
}

/*
*@description:Generate resume pdf
*/
export const generateResumePDF = async (id) => {
    const response = await api.post(`/interview/resume/pdf/${id}`, {}, { responseType: 'blob' });
    return response.data;
}
