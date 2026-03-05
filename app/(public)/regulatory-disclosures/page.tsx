'use client';

import { useState } from 'react';
import { FileText, ChevronDown, ChevronRight, ExternalLink, Download } from 'lucide-react';

// Corporate Governance data with actual PDFs
const corporateGovernanceData = {
    'Annual Returns': [
        {
            name: 'Annual Return - FY2025',
            pdf: 'Regulatory Disclosures/Corporate Governance/Annual Returns/Annual Return - FY2025.pdf',
        },
        {
            name: 'Annual Return - FY2024',
            pdf: 'Regulatory Disclosures/Corporate Governance/Annual Returns/Annual Return - FY2024.pdf',
        },
    ],
    'General Meeting Notices': [
        {
            name: '2nd AGM Notice',
            pdf: 'Regulatory Disclosures/Corporate Governance/General Meeting Notices/Annual General Meetings/2nd AGM Notice.pdf',
        },
        {
            name: 'Notice of EGM - 16.01.2026',
            pdf: 'Regulatory Disclosures/Corporate Governance/General Meeting Notices/Extra Ordinary General Meetings/FY 2025-26/Notice of EGM - 16.01.2026.pdf',
        },
    ],
    'CSR Projects': [] as { name: string; pdf: string }[],
};

// Statutory Policies data with actual PDFs
const statutoryPoliciesData: Record<string, { name: string; pdf: string }[]> = {
    'CSR Policy': [
        {
            name: 'CSR Policy',
            pdf: 'Regulatory Disclosures/Statutory Policies/CSR Policy.pdf',
        },
    ],
};

function getPdfApiUrl(filePath: string): string {
    return `/api/pdf?file=${encodeURIComponent(filePath)}`;
}

type TabType = 'corporate-governance' | 'statutory-policies';

export default function RegulatoryDisclosuresPage() {
    const [activeTab, setActiveTab] = useState<TabType>('corporate-governance');
    const [expandedSection, setExpandedSection] = useState<string | null>('Annual Returns');
    const [activePdf, setActivePdf] = useState<string | null>(null);
    const [activePdfName, setActivePdfName] = useState<string>('');

    const toggleSection = (section: string) => {
        setExpandedSection(expandedSection === section ? null : section);
    };

    const openPdf = (pdf: string, name: string) => {
        setActivePdf(pdf);
        setActivePdfName(name);
    };

    const activePdfUrl = activePdf ? getPdfApiUrl(activePdf) : null;

    return (
        <main className="min-h-screen bg-ivory-pearl pt-20">
            {/* Hero Section */}
            <section className="bg-gradient-to-b from-brand-900 to-brand-800 text-white py-16 md:py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-montserrat font-bold mb-4">
                        Regulatory Disclosures
                    </h1>
                    <p className="text-ivory-pearl/80 text-base md:text-lg max-w-2xl mx-auto">
                        Transparency and compliance are at the core of our values. Access our corporate governance documents and statutory policies below.
                    </p>
                </div>
            </section>

            {/* Tab Navigation */}
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-center gap-4 mb-8">
                    <button
                        onClick={() => {
                            setActiveTab('corporate-governance');
                            setActivePdf(null);
                        }}
                        className={`px-6 py-3 rounded-lg font-montserrat font-semibold text-sm md:text-base transition-all duration-300 border-2 ${activeTab === 'corporate-governance'
                            ? 'bg-classic-green text-white border-classic-green shadow-md'
                            : 'bg-white text-brand-800 border-brand-200 hover:border-classic-green/50'
                            }`}
                    >
                        Corporate Governance
                    </button>
                    <button
                        onClick={() => {
                            setActiveTab('statutory-policies');
                            setActivePdf(null);
                        }}
                        className={`px-6 py-3 rounded-lg font-montserrat font-semibold text-sm md:text-base transition-all duration-300 border-2 ${activeTab === 'statutory-policies'
                            ? 'bg-classic-green text-white border-classic-green shadow-md'
                            : 'bg-white text-brand-800 border-brand-200 hover:border-classic-green/50'
                            }`}
                    >
                        Statutory Policies
                    </button>
                </div>

                {/* Corporate Governance Content */}
                {activeTab === 'corporate-governance' && (
                    <div className="max-w-6xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Sidebar - Document List */}
                            <div className="lg:col-span-1 space-y-3">
                                {Object.entries(corporateGovernanceData).map(([section, docs]) => (
                                    <div key={section} className="bg-white rounded-xl shadow-sm border border-brand-100 overflow-hidden">
                                        <button
                                            onClick={() => toggleSection(section)}
                                            className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-brand-50 transition-colors"
                                        >
                                            <span className="font-montserrat font-semibold text-brand-800 text-sm">
                                                {section}
                                            </span>
                                            {expandedSection === section ? (
                                                <ChevronDown className="w-4 h-4 text-brand-600" />
                                            ) : (
                                                <ChevronRight className="w-4 h-4 text-brand-600" />
                                            )}
                                        </button>

                                        {expandedSection === section && (
                                            <div className="border-t border-brand-100 px-3 py-2">
                                                {docs.length > 0 ? (
                                                    docs.map((doc, idx) => (
                                                        <button
                                                            key={idx}
                                                            onClick={() => openPdf(doc.pdf, doc.name)}
                                                            className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-left text-sm transition-colors ${activePdf === doc.pdf
                                                                ? 'bg-classic-green/10 text-classic-green font-medium'
                                                                : 'text-brand-700 hover:bg-brand-50'
                                                                }`}
                                                        >
                                                            <FileText className="w-4 h-4 flex-shrink-0" />
                                                            <span className="truncate">{doc.name}</span>
                                                        </button>
                                                    ))
                                                ) : (
                                                    <p className="px-3 py-2.5 text-sm text-brand-400 italic">
                                                        Coming soon
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* PDF Viewer */}
                            <div className="lg:col-span-2">
                                {activePdfUrl ? (
                                    <div className="bg-white rounded-xl shadow-sm border border-brand-100 overflow-hidden">
                                        {/* Toolbar */}
                                        <div className="flex items-center justify-between px-5 py-3 bg-brand-50 border-b border-brand-100">
                                            <h3 className="font-montserrat font-semibold text-brand-800 text-sm truncate mr-4">
                                                {activePdfName}
                                            </h3>
                                            <div className="flex items-center gap-3 flex-shrink-0">
                                                <a
                                                    href={activePdfUrl}
                                                    download={`${activePdfName}.pdf`}
                                                    className="flex items-center gap-1.5 text-xs bg-classic-green text-white px-3 py-1.5 rounded-md hover:bg-classic-green/90 transition-colors font-medium"
                                                >
                                                    <Download className="w-3 h-3" /> Download
                                                </a>
                                                <a
                                                    href={activePdfUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1.5 text-xs text-classic-green hover:underline font-medium"
                                                >
                                                    Open in new tab <ExternalLink className="w-3 h-3" />
                                                </a>
                                            </div>
                                        </div>

                                        {/* PDF Embed */}
                                        <div style={{ height: '75vh' }}>
                                            <iframe
                                                key={activePdfUrl}
                                                src={activePdfUrl}
                                                className="w-full h-full border-0"
                                                title={activePdfName}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-white rounded-xl shadow-sm border border-brand-100 flex items-center justify-center" style={{ height: '50vh' }}>
                                        <div className="text-center p-8">
                                            <FileText className="w-16 h-16 text-brand-200 mx-auto mb-4" />
                                            <p className="text-brand-500 font-montserrat">
                                                Select a document from the left to view
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Statutory Policies Content */}
                {activeTab === 'statutory-policies' && (
                    <div className="max-w-3xl mx-auto">
                        {Object.keys(statutoryPoliciesData).length > 0 ? (
                            <div className="space-y-3">
                                {Object.entries(statutoryPoliciesData).map(([name, docs]) => (
                                    <div key={name} className="bg-white rounded-xl shadow-sm border border-brand-100 p-5">
                                        <h3 className="font-montserrat font-semibold text-brand-800 mb-3">{name}</h3>
                                        <ul className="space-y-2">
                                            {docs.map((doc, idx) => (
                                                <li key={idx}>
                                                    <a
                                                        href={getPdfApiUrl(doc.pdf)}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-2 text-sm text-brand-700 hover:text-classic-green transition-colors"
                                                    >
                                                        <FileText className="w-4 h-4" />
                                                        {doc.name}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl shadow-sm border border-brand-100 flex items-center justify-center" style={{ minHeight: '40vh' }}>
                                <div className="text-center p-8">
                                    <FileText className="w-16 h-16 text-brand-200 mx-auto mb-4" />
                                    <h3 className="font-montserrat font-semibold text-brand-800 mb-2">
                                        Statutory Policies
                                    </h3>
                                    <p className="text-brand-500 text-sm">
                                        Documents will be available shortly. Please check back later.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </main>
    );
}
