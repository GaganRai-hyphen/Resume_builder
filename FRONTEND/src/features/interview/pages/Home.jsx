import React, { useState, useRef } from 'react';
import "../style/home.scss";
import { useInterview } from '../hooks/useInterview'; 
import { useNavigate } from 'react-router';

const Home = () => {
    const { loading, generateReport, reports } = useInterview();
    const [jobDescription, setJobDescription] = useState("");
    const [selfDescription, setSelfDescription] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const resumeInputRef = useRef();
    const navigate = useNavigate();

    // Safely capture uploaded file into component state
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    // Dismount file from staging buffer and reset input reference
    const handleRemoveFile = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setSelectedFile(null);
        if (resumeInputRef.current) {
            resumeInputRef.current.value = "";
        }
    };

    const handleGenerateReport = async () => {
        // Enforce basic validation before hitting backend routing
        if (!jobDescription.trim()) {
            alert("Please provide a target Job Description.");
            return;
        }

        const resumeFile = selectedFile || resumeInputRef.current?.files[0];
        if (!resumeFile && !selfDescription.trim()) {
            alert("Please provide either a Resume PDF file or a Quick Self-Description.");
            return;
        }

        const generatedData = await generateReport({ jobDescription, selfDescription, resumeFile });
        
        // Execute dynamic routing strictly upon valid ID extraction
        if (generatedData && generatedData._id) {
            navigate(`/interview/${generatedData._id}`);
        } else {
            console.warn("Report generation failed or was aborted safely.");
        }
    };

    if (loading) {
        return (
            <main className='loading-screen'>
                <h1>Loading your interview plan...</h1>
            </main>
        );
    }

    return (
        <div className='home-page'>
            {/* Page Header */}
            <header className='page-header'>
                <h1>Create Your Custom <span className='highlight'>Interview Plan</span></h1>
                <p>Let our AI analyze the job requirements and your unique profile to build a winning strategy.</p>
            </header>

            {/* Main Card */}
            <div className='interview-card'>
                <div className='interview-card__body'>
                    {/* Left Panel - Job Description */}
                    <div className='panel panel--left'>
                        <div className='panel__header'>
                            <span className='panel__icon'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                            </span>
                            <h2>Target Job Description</h2>
                            <span className='badge badge--required'>Required</span>
                        </div>
                        <label htmlFor="jobDescInput" className="visually-hidden" style={{ display: 'none' }}>Target Job Description</label>
                        <textarea
                            id="jobDescInput"
                            name="jobDescription"
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            className='panel__textarea'
                            placeholder="Paste the full job description here..."
                            maxLength={5000}
                        />
                        {/* Dynamic Character Counter */}
                        <div className='char-counter'>
                            <span className={jobDescription.length > 4500 ? 'counter-warning' : ''}>
                                {jobDescription.length}
                            </span> / 5000 chars
                        </div>
                    </div>

                    <div className='panel-divider' />

                    {/* Right Panel - Profile Uploads */}
                    <div className='panel panel--right'>
                        <div className='panel__header'>
                            <span className='panel__icon'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                            </span>
                            <h2>Your Profile</h2>
                        </div>

                        {/* Dropzone / Staged File Display Block */}
                        <div className='upload-section'>
                            <label className='section-label'>
                                Upload Resume
                                <span className='badge badge--best'>Best Results</span>
                            </label>

                            {!selectedFile ? (
                                <label className='dropzone' htmlFor='resume'>
                                    <span className='dropzone__icon'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" /><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" /></svg>
                                    </span>
                                    <p className='dropzone__title'>Click to upload or drag &amp; drop</p>
                                    <p className='dropzone__subtitle'>PDF or DOCX (Max 5MB)</p>
                                    <input 
                                        ref={resumeInputRef} 
                                        onChange={handleFileChange} 
                                        hidden 
                                        type='file' 
                                        id='resume' 
                                        name='resume' 
                                        accept='.pdf,.docx' 
                                    />
                                </label>
                            ) : (
                                /* Active Staged Document Card */
                                <div className='staged-file-card' style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', border: '1px solid #475569', borderRadius: '8px', background: 'rgba(30, 41, 59, 0.5)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', overflow: 'hidden' }}>
                                        <span style={{ fontSize: '24px' }}>📄</span>
                                        <div style={{ overflow: 'hidden' }}>
                                            <p style={{ margin: 0, fontWeight: 600, fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {selectedFile.name}
                                            </p>
                                            <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>
                                                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                                            </p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={handleRemoveFile} 
                                        title="Clear attachment"
                                        style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '18px', cursor: 'pointer', padding: '4px 8px' }}
                                    >
                                        &times;
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className='or-divider'><span>OR</span></div>

                        {/* Manual Self-Description Input */}
                        <div className='self-description'>
                            <label className='section-label' htmlFor='selfDescription'>Quick Self-Description</label>
                            <textarea
                                value={selfDescription}
                                onChange={(e) => setSelfDescription(e.target.value)}
                                id='selfDescription'
                                className='panel__textarea panel__textarea--short'
                                placeholder="Briefly describe your experience, key skills, and years of experience..."
                            />
                        </div>

                        <div className='info-box'>
                            <p>Either a <strong>Resume</strong> or a <strong>Self Description</strong> is required to generate a personalized plan.</p>
                        </div>
                    </div>
                </div>

                {/* Footer Submission Action */}
                <div className='interview-card__footer'>
                    <span className='footer-info'>AI-Powered Strategy Generation &bull; Approx 30s</span>
                    <button onClick={handleGenerateReport} className='generate-btn'>
                        Generate My Interview Strategy
                    </button>
                </div>
            </div>

            {/* Historical Entries Rendering */}
            {reports?.length > 0 && (
                <section className='recent-reports'>
                    <h2>My Recent Interview Plans</h2>
                    <ul className='reports-list'>
                        {reports.map(reportItem => (
                            <li key={reportItem._id} className='report-item' onClick={() => navigate(`/interview/${reportItem._id}`)}>
                                <h3>{reportItem.title || 'Untitled Position'}</h3>
                                <p className='report-meta'>Generated on {new Date(reportItem.createdAt).toLocaleDateString()}</p>
                                <p className={`match-score ${reportItem.matchScore >= 80 ? 'score--high' : reportItem.matchScore >= 60 ? 'score--mid' : 'score--low'}`}>
                                    Match Score: {reportItem.matchScore}%
                                </p>
                            </li>
                        ))}
                    </ul>
                </section>
            )}
        </div>
    );
};

export default Home;