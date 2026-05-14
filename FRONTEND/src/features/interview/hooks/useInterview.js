import { getAllInterviewReports, generateInterviewReport, getInterviewReportById, generateResumePdf } from "../services/interview.api";
import { useContext, useEffect } from "react";
import { InterviewContext } from '../interview.context.jsx'; // Ensure path maps correctly to context
import { useParams } from "react-router";

export const useInterview = () => {
    const context = useContext(InterviewContext);
    const { interviewId } = useParams();

    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider");
    }

    const { loading, setLoading, report, setReport, reports, setReports } = context;

    const generateReport = async ({ jobDescription, selfDescription, resumeFile }) => {
        setLoading(true);
        try {
            const response = await generateInterviewReport({ jobDescription, selfDescription, resumeFile });
            if (response?.interviewReport) {
                setReport(response.interviewReport);
                return response.interviewReport;
            }
            return null;
        } catch (error) {
            console.error("API Generation Error:", error?.response?.data || error.message);
            return null; // Safely return null to prevent interface crashes
        } finally {
            setLoading(false);
        }
    };

    const getReportById = async (id) => {
        setLoading(true);
        try {
            const response = await getInterviewReportById(id);
            if (response?.interviewReport) {
                setReport(response.interviewReport);
                return response.interviewReport;
            }
        } catch (error) {
            console.error("Fetch Report Error:", error?.response?.data || error.message);
        } finally {
            setLoading(false);
        }
        return null;
    };

    const getReports = async () => {
        setLoading(true);
        try {
            const response = await getAllInterviewReports();
            if (response?.interviewReports) {
                setReports(response.interviewReports);
                return response.interviewReports;
            }
        } catch (error) {
            console.error("Fetch All Reports Error:", error?.response?.data || error.message);
        } finally {
            setLoading(false);
        }
        return [];
    };

    const getResumePdf = async (interviewReportId) => {
        setLoading(true);
        try {
            const responseBlob = await generateResumePdf({ interviewReportId });
            const url = window.URL.createObjectURL(new Blob([ responseBlob ], { type: "application/pdf" }));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `resume_${interviewReportId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Download PDF Error:", error?.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId);
        } else {
            getReports();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ interviewId ]);

    return { loading, report, reports, generateReport, getReportById, getReports, getResumePdf };
};