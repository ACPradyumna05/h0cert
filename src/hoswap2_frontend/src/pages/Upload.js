import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useRef } from 'react';
import "./Upload.css";
const Upload = () => {
    // State variables
    const [activeTab, setActiveTab] = useState('upload');
    const [currentFile, setCurrentFile] = useState(null);
    const [verified, setVerified] = useState(false);
    const [currentNFTId, setCurrentNFTId] = useState(null);
    const [uploadStatus, setUploadStatus] = useState({ message: '', type: '' });
    const [retrieveStatus, setRetrieveStatus] = useState({ message: '', type: '' });
    const [nftIdInput, setNftIdInput] = useState('');
    const [showNftResult, setShowNftResult] = useState(false);
    const [showDocumentPreview, setShowDocumentPreview] = useState(false);
    const [previewContent, setPreviewContent] = useState(null);
    // Refs
    const fileInputRef = useRef(null);
    const dropZoneRef = useRef(null);
    const uploadStatusRef = useRef(null);
    const retrieveStatusRef = useRef(null);
    // Mock database for document storage
    const [documentDatabase, setDocumentDatabase] = useState({});
    // Handle tab switching
    const openTab = (tabName) => {
        setActiveTab(tabName);
    };
    // Handle file selection
    const handleFileSelection = (file) => {
        setCurrentFile(file);
        showStatus('upload', `File selected: ${file.name}`, 'info');
        setVerified(false);
        setShowNftResult(false);
    };
    // File drop handlers
    const handleDragOver = (e) => {
        e.preventDefault();
        if (dropZoneRef.current) {
            dropZoneRef.current.style.borderColor = '#b62ff0';
            dropZoneRef.current.style.backgroundColor = 'rgba(182, 47, 240, 0.1)';
        }
    };
    const handleDragLeave = () => {
        if (dropZoneRef.current) {
            dropZoneRef.current.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            dropZoneRef.current.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
        }
    };
    const handleDrop = (e) => {
        e.preventDefault();
        handleDragLeave();
        if (e.dataTransfer.files.length) {
            handleFileSelection(e.dataTransfer.files[0]);
        }
    };
    const handleFileInputChange = (e) => {
        if (e.target.files && e.target.files.length) {
            handleFileSelection(e.target.files[0]);
        }
    };
    // Convert file to base64
    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                resolve(reader.result);
            };
            reader.onerror = (error) => {
                reject(error);
            };
            reader.readAsDataURL(file);
        });
    };
    // Show status message
    const showStatus = (type, message, statusType) => {
        if (type === 'upload') {
            setUploadStatus({ message, type: statusType });
            if (uploadStatusRef.current) {
                uploadStatusRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }
        else {
            setRetrieveStatus({ message, type: statusType });
            if (retrieveStatusRef.current) {
                retrieveStatusRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }
    };
    // Handle verify document
    const handleVerify = async () => {
        if (!currentFile) {
            showStatus('upload', 'Please select a file first', 'error');
            return;
        }
        showStatus('upload', 'Verifying document authenticity...', 'info');
        try {
            // Convert file to base64 for API
            const base64String = await fileToBase64(currentFile);
            // Send to API for verification (commented out for demo)
            /*
            const response = await fetch('http://localhost:5000/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                image: base64String.split(',')[1] // Remove data URL prefix
              })
            });
            
            const result: VerificationResponse = await response.json();
            
            if (result.verified) {
              setVerified(true);
              showStatus('upload', `Document verified successfully! Confidence: ${(result.confidence || 0) * 100}%`, 'success');
            } else {
              showStatus('upload', `Verification failed${result.error ? ': ' + result.error : ''}`, 'error');
            }
            */
            // Mock verification for demo purposes
            setTimeout(() => {
                setVerified(true);
                showStatus('upload', 'Document verified successfully! (Mock verification for demo)', 'success');
            }, 1500);
        }
        catch (error) {
            console.error('Verification error:', error);
            // Mock verification for demo purposes
            setTimeout(() => {
                setVerified(true);
                showStatus('upload', 'Document verified successfully! (Mock verification for demo)', 'success');
            }, 1500);
        }
    };
    // Handle push to blockchain
    const handlePushToBlockchain = () => {
        if (!verified) {
            showStatus('upload', 'Please verify your document first', 'error');
            return;
        }
        showStatus('upload', 'Pushing document to blockchain...', 'info');
        // Mock blockchain interaction for demo
        setTimeout(() => {
            // Generate a random NFT ID
            const newNFTId = 'DOC' + Math.floor(100000 + Math.random() * 900000);
            setCurrentNFTId(newNFTId);
            // Store in our mock database
            setDocumentDatabase(prev => ({
                ...prev,
                [newNFTId]: {
                    filename: currentFile.name,
                    uploadDate: new Date().toISOString(),
                    content: currentFile
                }
            }));
            showStatus('upload', 'Document pushed to blockchain successfully!', 'success');
        }, 2000);
    };
    // Handle fetch NFT ID
    const handleFetchNFTId = () => {
        if (!currentNFTId) {
            showStatus('upload', 'Please push your document to the blockchain first', 'error');
            return;
        }
        setShowNftResult(true);
        // Auto-fill the retrieval input for demo convenience
        setNftIdInput(currentNFTId);
    };
    // Handle fetch document
    const handleFetchDocument = () => {
        const nftId = nftIdInput.trim();
        if (!nftId) {
            showStatus('retrieve', 'Please enter an NFT ID', 'error');
            return;
        }
        showStatus('retrieve', 'Fetching document from blockchain...', 'info');
        // Mock fetch from database
        setTimeout(() => {
            const document = documentDatabase[nftId];
            if (document) {
                showStatus('retrieve', 'Document retrieved successfully!', 'success');
                // Display document info
                setShowDocumentPreview(true);
                setPreviewContent(_jsxs(_Fragment, { children: [_jsxs("p", { children: [_jsx("strong", { children: "Filename:" }), " ", document.filename] }), _jsxs("p", { children: [_jsx("strong", { children: "Upload Date:" }), " ", new Date(document.uploadDate).toLocaleString()] }), _jsxs("p", { children: [_jsx("strong", { children: "Document ID:" }), " ", nftId] }), _jsxs("p", { children: [_jsx("strong", { children: "Status:" }), " ", _jsx("span", { style: { color: '#2ed573' }, children: "\u2713 Verified" })] }), _jsx("p", { children: _jsx("em", { children: "Document content would be displayed or downloadable here" }) })] }));
            }
            else {
                showStatus('retrieve', 'No document found with this NFT ID', 'error');
                setShowDocumentPreview(false);
            }
        }, 1500);
    };
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: "container", children: _jsxs("nav", { children: [_jsxs("a", { href: "index.html", className: "logo", children: [_jsxs("svg", { width: "28", height: "28", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [_jsx("path", { d: "M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z", stroke: "#b62fb0", strokeWidth: "3" }), _jsx("path", { d: "M12 14.5C13.3807 14.5 14.5 13.3807 14.5 12C14.5 10.6193 13.3807 9.5 12 9.5C10.6193 9.5 9.5 10.6193 9.5 12C9.5 13.3807 10.6193 14.5 12 14.5Z", fill: "#b62fb0" }), _jsx("path", { d: "M12 8V2", stroke: "#b62fe0", strokeWidth: "3", strokeLinecap: "round" }), _jsx("path", { d: "M16 12H22", stroke: "#b62fe0", strokeWidth: "3", strokeLinecap: "round" })] }), "Certi", _jsx("span", { children: "Node" })] }), _jsxs("div", { className: "nav-links", children: [_jsx("a", { href: "#", children: "Features" }), _jsx("a", { href: "#", children: "How It Works" }), _jsx("a", { href: "#", children: "For Institutions" }), _jsx("a", { href: "#", children: "About" })] }), _jsx("a", { href: "login.html", className: "btn btn-secondary", children: "Login / Register" })] }) }), _jsxs("main", { className: "main-content", children: [_jsx("div", { className: "blob blob1" }), _jsx("div", { className: "blob blob2" }), _jsx("div", { className: "container", children: _jsxs("div", { className: "verification-container", children: [_jsxs("div", { className: "verification-sidebar", children: [_jsx("h2", { children: "Document Verification Portal" }), _jsx("p", { children: "Securely verify and store your academic credentials, certificates, and important documents on the blockchain." }), _jsxs("div", { className: "info-box", children: [_jsx("h4", { children: "Why Blockchain Verification?" }), _jsx("p", { children: "Once verified and pushed to the blockchain, your documents become tamper-proof, instantly verifiable, and accessible only with your consent." })] }), _jsxs("div", { className: "info-box", children: [_jsx("h4", { children: "How It Works" }), _jsx("p", { children: "Upload your document, our AI verifies its authenticity, then it's stored securely on the Internet Computer Protocol blockchain with a unique NFT ID." })] })] }), _jsxs("div", { className: "verification-content", children: [_jsxs("div", { className: "section-header", children: [_jsx("h2", { children: "Document Management System" }), _jsx("p", { children: "Upload, verify, and retrieve your important documents" })] }), _jsxs("div", { className: "tab-header", children: [_jsx("button", { className: `tab-btn ${activeTab === 'upload' ? 'active' : ''}`, onClick: () => openTab('upload'), children: "Upload Document" }), _jsx("button", { className: `tab-btn ${activeTab === 'retrieve' ? 'active' : ''}`, onClick: () => openTab('retrieve'), children: "Retrieve Document" })] }), _jsxs("div", { id: "upload", className: `tab-content ${activeTab === 'upload' ? 'active' : ''}`, children: [_jsxs("div", { className: "upload-area", id: "dropZone", ref: dropZoneRef, onClick: () => fileInputRef.current?.click(), onDragOver: handleDragOver, onDragLeave: handleDragLeave, onDrop: handleDrop, children: [_jsx("p", { children: "Drag & Drop your document here or click to browse" }), _jsx("input", { type: "file", id: "fileInput", ref: fileInputRef, style: { display: 'none' }, accept: ".pdf,.doc,.docx,.jpg,.jpeg,.png", onChange: handleFileInputChange })] }), uploadStatus.message && (_jsx("div", { ref: uploadStatusRef, className: `status ${uploadStatus.type}`, children: uploadStatus.message })), _jsx("button", { id: "verifyButton", className: "form-btn", onClick: handleVerify, children: "Verify Your Document" }), _jsx("button", { id: "pushButton", className: "form-btn", disabled: !verified, onClick: handlePushToBlockchain, children: "Push to Blockchain" }), _jsx("button", { id: "fetchNFTButton", className: "form-btn", disabled: !currentNFTId, onClick: handleFetchNFTId, children: "Fetch NFT ID" }), showNftResult && (_jsxs("div", { id: "nftResult", className: "nft-box", children: [_jsx("p", { children: "Your document has been successfully stored on the blockchain" }), _jsx("p", { children: "NFT ID:" }), _jsx("div", { id: "nftIdDisplay", className: "nft-id", children: currentNFTId || '-' }), _jsx("p", { children: "Store this ID safely to retrieve your document later" })] }))] }), _jsxs("div", { id: "retrieve", className: `tab-content ${activeTab === 'retrieve' ? 'active' : ''}`, children: [_jsxs("div", { className: "input-group", children: [_jsx("label", { htmlFor: "nftIdInput", children: "Enter your NFT ID:" }), _jsx("input", { type: "text", id: "nftIdInput", placeholder: "e.g., DOC123456", value: nftIdInput, onChange: (e) => setNftIdInput(e.target.value) })] }), _jsx("button", { id: "fetchDocumentButton", className: "form-btn", onClick: handleFetchDocument, children: "Fetch Document" }), retrieveStatus.message && (_jsx("div", { ref: retrieveStatusRef, className: `status ${retrieveStatus.type}`, children: retrieveStatus.message })), showDocumentPreview && (_jsxs("div", { id: "documentPreview", children: [_jsx("h3", { children: "Document Information" }), _jsx("div", { id: "previewContent", children: previewContent })] }))] })] })] }) })] }), _jsx("footer", { children: _jsxs("div", { className: "container", children: [_jsxs("div", { className: "footer-links", children: [_jsx("a", { href: "#", children: "Privacy Policy" }), _jsx("a", { href: "#", children: "Terms of Service" }), _jsx("a", { href: "#", children: "Contact Us" }), _jsx("a", { href: "#", children: "FAQ" })] }), _jsx("p", { className: "copyright", children: "\u00A9 2025 CertChain. Powered by Internet Computer Protocol." })] }) })] }));
};
export default Upload;
