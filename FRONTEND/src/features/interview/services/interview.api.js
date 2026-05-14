import axios from "axios";

const baseURL = import.meta.env.PROD ? window.location.origin : 'http://localhost:3000';

const api = axios.create({
    baseURL,
    withCredentials: true, // Guarantees JWT HTTP-only cookies are sent with every request
});

/**
 * @description Service to generate interview report based on user inputs.
 */
export const generateInterviewReport = async ({ jobDescription, selfDescription, resumeFile }) => {
    const formData = new FormData();
    formData.append("jobDescription", jobDescription);
    formData.append("selfDescription", selfDescription);
    if (resumeFile) {
        formData.append("resume", resumeFile);
    }

    const response = await api.post("/api/interview/", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });

    return response.data;
};

/**
 * @description Service to fetch a specific interview report by its ID.
 */
export const getInterviewReportById = async (interviewId) => {
    const response = await api.get(`/api/interview/report/${interviewId}`);
    return response.data;
};

/**
 * @description Service to fetch all historical interview reports for the active user.
 */
export const getAllInterviewReports = async () => {
    const response = await api.get("/api/interview/");
    return response.data;
};

/**
 * @description Service to trigger tailored PDF generation.
 */
export const generateResumePdf = async ({ interviewReportId }) => {
    const response = await api.post(`/api/interview/resume/pdf/${interviewReportId}`, null, {
        responseType: "blob"
    });
    return response.data;
};