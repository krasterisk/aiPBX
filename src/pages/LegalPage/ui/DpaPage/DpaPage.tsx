import { memo } from 'react'
import { Link } from 'react-router-dom'
import { Page } from '@/widgets/Page'
import { getRouteLegal } from '@/shared/const/router'
import cls from './DpaPage.module.scss'

const DpaPage = memo(() => (
    <Page data-testid="DpaPage">
        <article className={cls.document}>
            <Link to={getRouteLegal()} className={cls.backLink}>
                ← Back to Legal
            </Link>

            <header className={cls.header}>
                <h1 className={cls.title}>DATA PROCESSING AGREEMENT</h1>
                <p className={cls.meta}>Effective Date: February 13, 2026</p>
                <p className={cls.meta}>Last Updated: February 13, 2026</p>
            </header>

            <p className={cls.intro}>
                This Data Processing Agreement (&quot;DPA&quot;) forms part of the Terms
                of Service or other written agreement (the &quot;Agreement&quot;) between
                the customer identified in the Agreement (the &quot;Controller&quot;) and
                Lets Fix LLC, a limited liability company organized under the laws of the
                State of Illinois (&quot;Processor&quot;), and governs the processing of
                personal data by the Processor on behalf of the Controller in connection
                with the provision of the AI-powered voice bot platform services (the
                &quot;Services&quot;).
            </p>
            <p className={cls.intro}>
                This DPA is entered into pursuant to Article 28 of the General Data Protection
                Regulation (EU) 2016/679 (&quot;GDPR&quot;) and shall be interpreted in
                accordance with the GDPR. To the extent of any conflict between this DPA and
                the Agreement, this DPA shall prevail with respect to the processing of
                personal data.
            </p>

            {/* §1 — DEFINITIONS */}
            <section className={cls.section}>
                <h2 className={cls.sectionTitle}>1. Definitions</h2>
                <p className={cls.text}>
                    For the purposes of this DPA, the following terms shall have the meanings
                    set forth below. Capitalized terms not defined herein shall have the
                    meanings given to them in the Agreement or the GDPR.
                </p>
                <ul className={cls.list}>
                    <li>
                        <strong>&quot;Personal Data&quot;</strong> means any information
                        relating to an identified or identifiable natural person
                        (&quot;Data Subject&quot;) as defined in Article 4(1) of the GDPR.
                    </li>
                    <li>
                        <strong>&quot;Processing&quot;</strong> means any operation or set of
                        operations performed on Personal Data, as defined in Article 4(2)
                        of the GDPR, including collection, recording, storage, adaptation,
                        retrieval, use, disclosure, erasure, and destruction.
                    </li>
                    <li>
                        <strong>&quot;Controller&quot;</strong> means the customer entity that
                        determines the purposes and means of Processing of Personal Data.
                    </li>
                    <li>
                        <strong>&quot;Processor&quot;</strong> means Lets Fix LLC, which
                        processes Personal Data on behalf of the Controller.
                    </li>
                    <li>
                        <strong>&quot;Sub-processor&quot;</strong> means any third party
                        engaged by the Processor to process Personal Data on behalf of the
                        Controller.
                    </li>
                    <li>
                        <strong>&quot;Data Breach&quot;</strong> means a breach of security
                        leading to the accidental or unlawful destruction, loss, alteration,
                        unauthorized disclosure of, or access to, Personal Data transmitted,
                        stored, or otherwise processed.
                    </li>
                    <li>
                        <strong>&quot;Standard Contractual Clauses&quot; (&quot;SCCs&quot;)</strong>{' '}
                        means the standard contractual clauses for the transfer of Personal Data
                        to third countries adopted by the European Commission pursuant to
                        Commission Implementing Decision (EU) 2021/914.
                    </li>
                </ul>
            </section>

            {/* §2 — SUBJECT MATTER & DURATION */}
            <section className={cls.section}>
                <h2 className={cls.sectionTitle}>2. Subject Matter and Duration</h2>
                <p className={cls.text}>
                    <strong>2.1 Subject Matter.</strong> This DPA governs the Processor&#39;s
                    processing of Personal Data on behalf of the Controller in connection with
                    the provision of the Services, which include AI-powered voice bot
                    functionality, call processing, speech-to-text transcription, AI response
                    generation, and analytics.
                </p>
                <p className={cls.text}>
                    <strong>2.2 Duration.</strong> This DPA shall remain in effect for the
                    duration of the Agreement. The Processor&#39;s obligations under this DPA
                    with respect to data deletion and return shall survive termination of the
                    Agreement until all Personal Data has been deleted or returned in accordance
                    with Section 11.
                </p>
            </section>

            {/* §3 — NATURE & PURPOSE */}
            <section className={cls.section}>
                <h2 className={cls.sectionTitle}>
                    3. Nature and Purpose of Processing
                </h2>
                <p className={cls.text}>
                    The Processor shall process Personal Data solely to provide, maintain,
                    and support the Services as described in the Agreement, including:
                </p>
                <ul className={cls.list}>
                    <li>
                        Receiving, routing, and processing inbound and outbound voice calls
                        through SIP/PBX integration.
                    </li>
                    <li>
                        Performing speech-to-text transcription of voice calls using AI
                        and machine learning systems.
                    </li>
                    <li>
                        Generating AI-powered voice responses and conversational interactions.
                    </li>
                    <li>
                        Storing and managing call metadata, transcripts, and analytics data.
                    </li>
                    <li>
                        Providing usage analytics, reporting, and dashboard functionality.
                    </li>
                </ul>
                <p className={cls.text}>
                    The Processor shall not process Personal Data for any purpose other than
                    as set forth in this DPA and the Controller&#39;s documented instructions,
                    unless required to do so by applicable law, in which case the Processor
                    shall inform the Controller of such legal requirement prior to processing
                    (unless prohibited by law from doing so).
                </p>
                <p className={cls.text}>
                    <strong>AI-Specific Obligations.</strong> The Processor shall:
                </p>
                <ul className={cls.list}>
                    <li>
                        <strong>Not</strong> use Personal Data, voice data, transcripts,
                        or conversation logs to train, fine-tune, or improve AI or machine
                        learning models, whether the Processor&#39;s own or those of any
                        third party.
                    </li>
                    <li>
                        <strong>Not</strong> create voiceprints, biometric identifiers,
                        or speaker profiles from voice data.
                    </li>
                    <li>
                        <strong>Not</strong> use call content, transcripts, or conversation
                        logs for profiling, marketing, behavioral advertising, or independent
                        analytics purposes. Call-related data is processed exclusively to
                        provide the Services on behalf of the Controller.
                    </li>
                    <li>
                        Process voice audio in real-time only for transcription purposes;
                        voice audio is not stored as audio after processing.
                    </li>
                    <li>
                        AI-generated outputs (responses, transcripts) are produced solely
                        in connection with the Services and are not retained or used by the
                        Processor beyond the immediate processing purpose and the
                        Controller&#39;s retention settings.
                    </li>
                </ul>
            </section>

            {/* §4 — TYPES OF PERSONAL DATA */}
            <section className={cls.section}>
                <h2 className={cls.sectionTitle}>4. Types of Personal Data Processed</h2>
                <p className={cls.text}>
                    The following types of Personal Data may be processed under this DPA:
                </p>
                <div className={cls.table}>
                    <div className={cls.tableHeader}>
                        <span>Category</span>
                        <span>Examples</span>
                    </div>
                    <div className={cls.tableRow}>
                        <span>Voice Data</span>
                        <span>Real-time voice audio processed for transcription (not stored as audio)</span>
                    </div>
                    <div className={cls.tableRow}>
                        <span>Transcripts</span>
                        <span>Text transcriptions of calls, AI conversation logs</span>
                    </div>
                    <div className={cls.tableRow}>
                        <span>Phone Numbers</span>
                        <span>Caller and callee telephone numbers, SIP identifiers</span>
                    </div>
                    <div className={cls.tableRow}>
                        <span>Call Metadata</span>
                        <span>Call timestamps, duration, direction, disposition, routing data</span>
                    </div>
                    <div className={cls.tableRow}>
                        <span>Account Data</span>
                        <span>Controller&#39;s user names, email addresses, roles, preferences</span>
                    </div>
                    <div className={cls.tableRow}>
                        <span>Technical Data</span>
                        <span>IP addresses, user agent strings, session identifiers</span>
                    </div>
                </div>
                <p className={cls.text}>
                    The Controller shall not submit special categories of data (Article 9
                    GDPR) to the Services unless the Controller has ensured a lawful basis
                    and has informed the Processor in advance. The Processor does not
                    intentionally collect or process special category data.
                </p>
            </section>

            {/* §5 — CATEGORIES OF DATA SUBJECTS */}
            <section className={cls.section}>
                <h2 className={cls.sectionTitle}>5. Categories of Data Subjects</h2>
                <p className={cls.text}>
                    Personal Data processed under this DPA may relate to the following
                    categories of Data Subjects:
                </p>
                <ul className={cls.list}>
                    <li>
                        <strong>Call Participants:</strong> Individuals who make or receive
                        calls processed by the Services, including the Controller&#39;s
                        customers, prospects, and other third parties.
                    </li>
                    <li>
                        <strong>Controller Personnel:</strong> The Controller&#39;s employees,
                        agents, contractors, and authorized users who access the Services
                        platform.
                    </li>
                    <li>
                        <strong>Business Contacts:</strong> Individuals whose contact
                        information is stored or processed through the Services in connection
                        with the Controller&#39;s business activities.
                    </li>
                </ul>
            </section>

            {/* §6 — PROCESSOR OBLIGATIONS */}
            <section className={cls.section}>
                <h2 className={cls.sectionTitle}>6. Obligations of the Processor</h2>
                <p className={cls.text}>
                    The Processor shall, in respect of Personal Data processed on behalf
                    of the Controller:
                </p>
                <ul className={cls.list}>
                    <li>
                        <strong>6.1 Documented Instructions.</strong> Process Personal Data
                        only on the documented instructions of the Controller, including
                        with regard to transfers of Personal Data to a third country, unless
                        required to do so by Union or Member State law to which the Processor
                        is subject (Article 28(3)(a) GDPR).
                    </li>
                    <li>
                        <strong>6.2 Confidentiality.</strong> Ensure that all persons
                        authorized to process Personal Data have committed to confidentiality
                        or are under an appropriate statutory obligation of confidentiality
                        (Article 28(3)(b) GDPR).
                    </li>
                    <li>
                        <strong>6.3 Security.</strong> Implement and maintain appropriate
                        technical and organizational measures to ensure a level of security
                        appropriate to the risk, as specified in Section 7 of this DPA
                        (Article 28(3)(c) and Article 32 GDPR).
                    </li>
                    <li>
                        <strong>6.4 Sub-processor Engagement.</strong> Not engage another
                        processor without complying with the requirements set forth in
                        Section 8 of this DPA (Article 28(2) and (4) GDPR).
                    </li>
                    <li>
                        <strong>6.5 Data Subject Assistance.</strong> Taking into account the
                        nature of the processing, assist the Controller by appropriate
                        technical and organizational measures for the fulfilment of the
                        Controller&#39;s obligations to respond to Data Subject requests
                        (Article 28(3)(e) GDPR), as detailed in Section 10.
                    </li>
                    <li>
                        <strong>6.6 Compliance Assistance.</strong> Assist the Controller in
                        ensuring compliance with its obligations under Articles 32–36 GDPR,
                        taking into account the nature of processing and the information
                        available to the Processor (Article 28(3)(f) GDPR). This includes
                        providing, upon reasonable request, such information about the
                        Processing as is reasonably necessary for the Controller to carry
                        out data protection impact assessments (Article 35 GDPR) and prior
                        consultations with supervisory authorities (Article 36 GDPR).
                    </li>
                    <li>
                        <strong>6.7 Deletion or Return.</strong> At the choice of the
                        Controller, delete or return all Personal Data upon termination of
                        the Agreement, as specified in Section 12 (Article 28(3)(g) GDPR).
                    </li>
                    <li>
                        <strong>6.8 Audit and Information.</strong> Make available to the
                        Controller all information necessary to demonstrate compliance with
                        the obligations laid down in Article 28 GDPR and allow for and
                        contribute to audits, as specified in Section 13
                        (Article 28(3)(h) GDPR).
                    </li>
                    <li>
                        <strong>6.9 Notification of Unlawful Instructions.</strong> Immediately
                        inform the Controller if, in the Processor&#39;s opinion, an
                        instruction from the Controller infringes the GDPR or other applicable
                        data protection provisions (Article 28(3) GDPR). The Processor&#39;s
                        notification under this clause does not constitute legal advice and
                        does not create an obligation for the Processor to monitor or assess
                        the Controller&#39;s overall compliance with the GDPR or any other law.
                    </li>
                </ul>
            </section>

            {/* §7 — SECURITY MEASURES */}
            <section className={cls.section}>
                <h2 className={cls.sectionTitle}>
                    7. Security Measures (Technical &amp; Organizational)
                </h2>
                <p className={cls.text}>
                    The Processor shall implement and maintain at least the following
                    technical and organizational measures pursuant to Article 32 GDPR,
                    taking into account the state of the art, the costs of implementation,
                    and the nature, scope, context, and purposes of Processing:
                </p>

                <h3 className={cls.subsectionTitle}>7.1 Encryption</h3>
                <ul className={cls.list}>
                    <li>Data in transit: TLS 1.2 or higher for all connections.</li>
                    <li>Data at rest: AES-256 encryption for stored Personal Data, including
                        transcripts, conversation logs, and database contents.</li>
                    <li>Encryption key management with regular key rotation.</li>
                </ul>

                <h3 className={cls.subsectionTitle}>7.2 Access Control</h3>
                <ul className={cls.list}>
                    <li>Role-based access control (RBAC) with least-privilege principles.</li>
                    <li>Multi-factor authentication (MFA) for all administrative access.</li>
                    <li>Unique user credentials with prohibition on shared accounts.</li>
                    <li>Automated session timeout and account lockout.</li>
                </ul>

                <h3 className={cls.subsectionTitle}>7.3 Infrastructure Security</h3>
                <ul className={cls.list}>
                    <li>Network firewalls and intrusion detection/prevention systems (IDS/IPS).</li>
                    <li>Regular vulnerability assessments and penetration testing.</li>
                    <li>Segregation of production and development environments.</li>
                    <li>Automated patching and security updates.</li>
                </ul>

                <h3 className={cls.subsectionTitle}>7.4 Organizational Measures</h3>
                <ul className={cls.list}>
                    <li>Mandatory security awareness training for all personnel.</li>
                    <li>Background checks for personnel with access to Personal Data.</li>
                    <li>Written information security policies and procedures.</li>
                    <li>Documented incident response and disaster recovery plans.</li>
                    <li>Regular review and testing of security measures.</li>
                </ul>

                <h3 className={cls.subsectionTitle}>7.5 Data Minimization and Pseudonymization</h3>
                <ul className={cls.list}>
                    <li>Collection limited to Personal Data necessary for the specified purposes.</li>
                    <li>Pseudonymization applied where feasible and appropriate.</li>
                    <li>Logical separation of Controller data from other customers&#39; data.</li>
                </ul>
            </section>

            {/* §8 — SUB-PROCESSORS */}
            <section className={cls.section}>
                <h2 className={cls.sectionTitle}>8. Sub-processors</h2>
                <p className={cls.text}>
                    <strong>8.1 General Authorization.</strong> The Controller provides general
                    written authorization for the Processor to engage Sub-processors to
                    carry out specific processing activities on behalf of the Controller.
                    A current list of authorized Sub-processors is set out in Annex B of
                    this DPA and is available upon request at{' '}
                    <a href="mailto:privacy@aipbx.net" className={cls.link}>privacy@aipbx.net</a>.
                </p>
                <p className={cls.text}>
                    <strong>8.2 Notification of Changes.</strong> The Processor shall inform
                    the Controller of any intended changes concerning the addition or
                    replacement of Sub-processors, giving the Controller at least fifteen
                    (15) days&#39; advance written notice. The Controller may object to such
                    changes within that period. If the Controller objects on reasonable grounds
                    related to data protection, the parties shall discuss the concern in good
                    faith. If no resolution is reached within thirty (30) days, the Controller
                    may terminate the affected Services without penalty.
                </p>
                <p className={cls.text}>
                    <strong>8.3 Sub-processor Obligations.</strong> Where the Processor engages
                    a Sub-processor, it shall:
                </p>
                <ul className={cls.list}>
                    <li>
                        Impose on the Sub-processor, by way of a written contract, the same
                        data protection obligations as set out in this DPA, in particular
                        providing sufficient guarantees to implement appropriate technical
                        and organizational measures (Article 28(4) GDPR).
                    </li>
                    <li>
                        Exercise commercially reasonable due diligence in the selection
                        and ongoing oversight of Sub-processors. The Processor shall remain
                        liable to the Controller for the performance of the Sub-processor&#39;s
                        data protection obligations to the extent that the Processor has
                        failed to fulfill its due diligence and oversight obligations under
                        this clause, subject to the liability limitations in Section 14 and
                        the Agreement. The Processor shall not be liable for the independent
                        actions of Sub-processors that are beyond the Processor&#39;s
                        reasonable control, including unauthorized processing or security
                        breaches at the Sub-processor level that occur despite the
                        Processor&#39;s commercially reasonable oversight.
                    </li>
                </ul>

                <h3 className={cls.subsectionTitle}>
                    Annex B — Current Sub-processors
                </h3>
                <div className={cls.table}>
                    <div className={cls.tableHeader}>
                        <span>Sub-processor</span>
                        <span>Purpose</span>
                        <span>Location</span>
                    </div>
                    <div className={cls.tableRow}>
                        <span>Amazon Web Services, Inc.</span>
                        <span>Hosting, compute, storage</span>
                        <span>United States</span>
                    </div>
                    <div className={cls.tableRow}>
                        <span>Stripe, Inc.</span>
                        <span>Payment processing</span>
                        <span>United States</span>
                    </div>
                    <div className={cls.tableRow}>
                        <span>OpenAI, Inc.</span>
                        <span>Speech-to-text, AI response generation</span>
                        <span>United States</span>
                    </div>
                    <div className={cls.tableRow}>
                        <span>Twilio Inc.</span>
                        <span>Voice call routing and connectivity (SIP/PBX)</span>
                        <span>United States</span>
                    </div>
                    <div className={cls.tableRow}>
                        <span>SendGrid (Twilio Inc.)</span>
                        <span>Transactional and support emails</span>
                        <span>United States</span>
                    </div>
                </div>
                <p className={cls.text}>
                    The Processor shall maintain the current list of Sub-processors and
                    make it available to the Controller upon request at{' '}
                    <a href="mailto:privacy@aipbx.net" className={cls.link}>privacy@aipbx.net</a>.
                    The Processor reserves the right to update this list in accordance with
                    Section 8.2.
                </p>
            </section>

            {/* §9 — INTERNATIONAL TRANSFERS */}
            <section className={cls.section}>
                <h2 className={cls.sectionTitle}>
                    9. International Data Transfers
                </h2>
                <p className={cls.text}>
                    <strong>9.1 Transfer Mechanism.</strong> The Processor&#39;s Services are
                    hosted in the United States. Any transfer of Personal Data from the
                    European Economic Area (EEA), United Kingdom, or Switzerland to the
                    United States shall be conducted in compliance with Chapter V of the GDPR
                    using one or more of the following transfer mechanisms:
                </p>
                <ul className={cls.list}>
                    <li>
                        <strong>Standard Contractual Clauses (SCCs):</strong> The parties
                        hereby incorporate by reference the Standard Contractual Clauses
                        adopted by the European Commission pursuant to Commission Implementing
                        Decision (EU) 2021/914 (Module Two: Controller to Processor). The SCCs
                        shall be deemed completed as follows: (a) the Controller is the
                        &quot;data exporter&quot;; (b) the Processor is the &quot;data
                        importer&quot;; (c) Annex I, II, and III of the SCCs are populated
                        with the information set forth in this DPA.
                    </li>
                    <li>
                        <strong>UK International Data Transfer Agreement (IDTA):</strong>{' '}
                        For transfers of Personal Data from the United Kingdom, the parties
                        shall execute the UK International Data Transfer Agreement or the
                        UK Addendum to the EU SCCs (as approved by the UK Information
                        Commissioner&#39;s Office), as applicable.
                    </li>
                    <li>
                        <strong>Swiss Data Protection:</strong> For transfers of Personal
                        Data from Switzerland, the parties shall rely on the Swiss-US Data
                        Privacy Framework (where applicable) or Swiss-approved Standard
                        Contractual Clauses, in accordance with the Swiss Federal Act on
                        Data Protection (FADP).
                    </li>
                    <li>
                        <strong>EU-US Data Privacy Framework:</strong> Where applicable and
                        where the Processor or its Sub-processors maintain valid certification
                        under the EU-US Data Privacy Framework, UK Extension, and/or
                        Swiss-US Data Privacy Framework.
                    </li>
                </ul>
                <p className={cls.text}>
                    <strong>9.2 Supplementary Measures.</strong> In addition to the SCCs, the
                    Processor shall implement supplementary technical and organizational
                    measures as described in Section 7, including encryption in transit and
                    at rest, access controls, and data minimization, to ensure an essentially
                    equivalent level of data protection. The Processor has conducted a
                    transfer impact assessment in accordance with the <em>Schrems II</em>{' '}
                    decision (Case C-311/18) and shall make it available to the Controller
                    upon reasonable request.
                </p>
                <p className={cls.text}>
                    <strong>9.3 Government Access Requests.</strong> The Processor shall
                    promptly notify the Controller of any legally binding request for
                    disclosure of Personal Data by a law enforcement authority, unless
                    prohibited by law. The Processor shall not voluntarily disclose Personal
                    Data to any government authority without the Controller&#39;s prior
                    written consent.
                </p>
            </section>

            {/* §10 — DATA BREACH */}
            <section className={cls.section}>
                <h2 className={cls.sectionTitle}>10. Data Breach Notification</h2>
                <p className={cls.text}>
                    <strong>10.1 Notification.</strong> The Processor shall notify the
                    Controller without undue delay, and in any event within forty-eight
                    (48) hours, after becoming aware of a Data Breach affecting Personal
                    Data processed on behalf of the Controller (Article 33(2) GDPR). An
                    initial notification with known details shall be provided within
                    twenty-four (24) hours, with supplementary information to follow as
                    it becomes available.
                </p>
                <p className={cls.text}>
                    <strong>10.2 Content of Notification.</strong> The notification shall
                    include, to the extent known at the time:
                </p>
                <ul className={cls.list}>
                    <li>The nature of the Data Breach, including (where possible) the
                        categories and approximate number of Data Subjects and Personal
                        Data records concerned.</li>
                    <li>The name and contact details of the Processor&#39;s data protection
                        point of contact.</li>
                    <li>A description of the likely consequences of the Data Breach.</li>
                    <li>A description of the measures taken or proposed to be taken to
                        address the Data Breach, including measures to mitigate its
                        possible adverse effects.</li>
                </ul>
                <p className={cls.text}>
                    <strong>10.3 Ongoing Cooperation.</strong> The Processor shall cooperate
                    with the Controller and take commercially reasonable steps to assist in
                    the investigation, mitigation, and remediation of the Data Breach.
                    The Processor shall not inform any third party of a Data Breach affecting
                    the Controller&#39;s Personal Data without the Controller&#39;s prior
                    written consent, unless required by applicable law.
                </p>
                <p className={cls.text}>
                    <strong>10.4 Documentation.</strong> The Processor shall maintain a record
                    of all Data Breaches, including the facts relating to the breach, its
                    effects, and the remedial actions taken (Article 33(5) GDPR).
                </p>
            </section>

            {/* §11 — DATA SUBJECT REQUESTS */}
            <section className={cls.section}>
                <h2 className={cls.sectionTitle}>
                    11. Assistance with Data Subject Requests
                </h2>
                <p className={cls.text}>
                    <strong>11.1 Obligation.</strong> Taking into account the nature of the
                    Processing, the Processor shall assist the Controller by appropriate
                    technical and organizational measures, insofar as this is possible,
                    for the fulfilment of the Controller&#39;s obligation to respond to
                    requests for exercising Data Subject&#39;s rights under Chapter III
                    of the GDPR, including:
                </p>
                <ul className={cls.list}>
                    <li>Right of access (Article 15)</li>
                    <li>Right to rectification (Article 16)</li>
                    <li>Right to erasure (Article 17)</li>
                    <li>Right to restriction of processing (Article 18)</li>
                    <li>Right to data portability (Article 20)</li>
                    <li>Right to object (Article 21)</li>
                </ul>
                <p className={cls.text}>
                    <strong>11.2 Direct Requests.</strong> If the Processor receives a request
                    directly from a Data Subject regarding the Controller&#39;s Personal Data,
                    the Processor shall promptly redirect the request to the Controller and
                    shall not respond to the request directly unless instructed by the
                    Controller or required by law.
                </p>
                <p className={cls.text}>
                    <strong>11.3 Response Time.</strong> The Processor shall respond to the
                    Controller&#39;s reasonable requests for assistance within ten (10)
                    business days.
                </p>
            </section>

            {/* §12 — DATA DELETION / RETURN */}
            <section className={cls.section}>
                <h2 className={cls.sectionTitle}>
                    12. Data Deletion or Return Upon Termination
                </h2>
                <p className={cls.text}>
                    <strong>12.1 Controller Choice.</strong> Upon termination or expiration
                    of the Agreement, the Controller may instruct the Processor to either:
                    (a) return all Personal Data to the Controller in a structured, commonly
                    used, machine-readable format (such as JSON, CSV, or XML, as mutually
                    agreed); or (b) delete all Personal Data.
                </p>
                <p className={cls.text}>
                    <strong>12.2 Export Period.</strong> The Processor shall provide the
                    Controller with a period of thirty (30) days following termination to
                    export Personal Data via the Services platform or through a data export
                    request to{' '}
                    <a href="mailto:privacy@aipbx.net" className={cls.link}>privacy@aipbx.net</a>.
                </p>
                <p className={cls.text}>
                    <strong>12.3 Deletion Timeline.</strong> Unless the Controller instructs
                    otherwise within the export period, the Processor shall delete all
                    Personal Data within ninety (90) days after the end of the export period.
                    The Processor shall certify the deletion in writing to the Controller
                    upon request.
                </p>
                <p className={cls.text}>
                    <strong>12.4 Legal Retention.</strong> The Processor may retain Personal
                    Data to the extent required by applicable law (e.g., tax records, billing
                    records), provided that the Processor shall: (a) process such retained
                    data only for the purpose of complying with legal obligations; (b) ensure
                    the confidentiality of such data; and (c) delete the data when the
                    retention obligation expires.
                </p>
            </section>

            {/* §13 — AUDIT RIGHTS */}
            <section className={cls.section}>
                <h2 className={cls.sectionTitle}>13. Audit Rights</h2>
                <p className={cls.text}>
                    <strong>13.1 Information.</strong> The Processor shall make available to
                    the Controller all information reasonably necessary to demonstrate
                    compliance with the obligations laid down in Article 28 of the GDPR
                    and this DPA.
                </p>
                <p className={cls.text}>
                    <strong>13.2 Audits.</strong> The Controller (or an independent third-party
                    auditor appointed by the Controller) may conduct audits and inspections of
                    the Processor&#39;s data processing activities and facilities, subject
                    to the following conditions:
                </p>
                <ul className={cls.list}>
                    <li>
                        The Controller shall provide at least thirty (30) days&#39; advance
                        written notice of any audit (except in the case of a Data Breach,
                        where reasonable notice shall apply).
                    </li>
                    <li>
                        Audits shall be conducted during normal business hours with minimal
                        disruption to the Processor&#39;s operations.
                    </li>
                    <li>
                        Audits shall be limited to the Processor&#39;s processing activities
                        relevant to the Controller&#39;s Personal Data and shall not extend
                        to other customers&#39; data, proprietary algorithms, trade secrets,
                        or confidential business information. The Processor may redact
                        information relating to other customers or proprietary business
                        operations.
                    </li>
                    <li>
                        The Controller shall bear its own costs of the audit. If the audit
                        requires the Processor to allocate resources beyond a reasonable
                        level, the Processor may charge the Controller at its standard
                        professional services rates.
                    </li>
                    <li>
                        The Controller shall not audit more than once per twelve (12) month
                        period, unless required by a supervisory authority or prompted by a
                        Data Breach.
                    </li>
                    <li>
                        Any third-party auditor must execute a written confidentiality
                        agreement acceptable to the Processor before conducting the audit,
                        and shall not be a competitor of the Processor.
                    </li>
                </ul>
                <p className={cls.text}>
                    <strong>13.3 Certifications.</strong> The Processor may, at its discretion,
                    satisfy audit requests by providing the Controller with relevant
                    certifications (e.g., SOC 2 Type II, ISO 27001), penetration testing
                    reports, or third-party audit reports, subject to confidentiality
                    obligations. Provision of such documentation shall constitute compliance
                    with Section 13.2 unless the Controller has reasonable grounds to require
                    an on-site audit.
                </p>
            </section>

            {/* §14 — LIABILITY */}
            <section className={cls.section}>
                <h2 className={cls.sectionTitle}>14. Liability</h2>
                <p className={cls.text}>
                    <strong>14.1 Liability Cap.</strong> Each party&#39;s aggregate liability
                    under this DPA, whether in contract, tort, or otherwise, shall not
                    exceed the greater of: (a) the total fees paid or payable by the
                    Controller to the Processor under the Agreement in the twelve (12)
                    months immediately preceding the event giving rise to the claim; or
                    (b) fifty thousand US dollars (US $50,000). This limitation shall
                    apply to the maximum extent permitted by applicable law but shall not
                    limit either party&#39;s liability for:
                </p>
                <ul className={cls.list}>
                    <li>
                        Fines or penalties imposed directly on that party by a supervisory
                        authority under the GDPR or applicable data protection law.
                    </li>
                    <li>
                        Liability arising from that party&#39;s willful misconduct or
                        intentional, deliberate breach of its material data protection
                        obligations under this DPA.
                    </li>
                </ul>
                <p className={cls.text}>
                    <strong>14.2 Exclusion of Consequential Damages.</strong> In no event
                    shall either party be liable under this DPA for any indirect,
                    incidental, special, consequential, or punitive damages, or for loss
                    of profits, revenue, data, or business opportunities, regardless of
                    the theory of liability, even if advised of the possibility of such
                    damages.
                </p>
                <p className={cls.text}>
                    <strong>14.3 Data Subject Compensation.</strong> In accordance with
                    Article 82 GDPR, where a Data Subject exercises their right to receive
                    compensation from the Processor for material or non-material damage, the
                    Processor shall be liable for the damage caused by its processing only
                    where it has not complied with the GDPR obligations specifically directed
                    to processors, or where it has acted outside of or contrary to the
                    Controller&#39;s lawful instructions.
                </p>
                <p className={cls.text}>
                    <strong>14.4 Indemnification.</strong> The Processor shall indemnify the
                    Controller against direct costs, claims, and expenses incurred by
                    the Controller arising from the Processor&#39;s material breach of this
                    DPA or the GDPR, subject to: (a) the aggregate liability cap in
                    Section 14.1; (b) the Controller having promptly notified the
                    Processor in writing of any claim; (c) the Controller providing the
                    Processor with sole control of the defense and settlement of such
                    claim; (d) the Controller providing reasonable cooperation; and
                    (e) the Controller having taken reasonable steps to mitigate damages.
                    This indemnification shall be the Controller&#39;s sole and exclusive
                    remedy for any breach of this DPA by the Processor.
                </p>
                <p className={cls.text}>
                    <strong>14.5 Controller Responsibility.</strong> The Controller shall
                    remain responsible for ensuring: (a) the lawfulness of its instructions
                    to the Processor; (b) that it has a valid legal basis for processing
                    Personal Data; (c) compliance with its own obligations under the GDPR,
                    including providing notice to Data Subjects and obtaining required
                    consents. The Controller shall indemnify the Processor against all
                    costs, claims, and expenses arising from the Controller&#39;s breach
                    of its obligations under this DPA or applicable data protection law,
                    or from processing instructions that are unlawful.
                </p>
            </section>

            {/* §15 — GENERAL PROVISIONS */}
            <section className={cls.section}>
                <h2 className={cls.sectionTitle}>15. General Provisions</h2>
                <p className={cls.text}>
                    <strong>15.1 Governing Law.</strong> This DPA shall be governed by and
                    construed in accordance with the laws of the State of Illinois, without
                    regard to its conflict of laws principles. For Data Subjects in the EEA,
                    nothing in this DPA shall limit the rights available to them under the
                    GDPR and applicable Member State law.
                </p>
                <p className={cls.text}>
                    <strong>15.2 Dispute Resolution.</strong> Any dispute arising under or
                    in connection with this DPA that cannot be resolved by good-faith
                    negotiation within thirty (30) days shall be subject to the dispute
                    resolution provisions of the Agreement. In the absence of such
                    provisions, the parties agree to submit to the exclusive jurisdiction
                    of the state and federal courts located in Cook County, Illinois.
                </p>
                <p className={cls.text}>
                    <strong>15.3 Order of Precedence.</strong> In the event of a conflict
                    between this DPA and the Agreement, this DPA shall prevail with respect
                    to the Processing of Personal Data. In the event of a conflict between
                    this DPA and the SCCs, the SCCs shall prevail.
                </p>
                <p className={cls.text}>
                    <strong>15.4 Amendments.</strong> This DPA may be amended only by a
                    written instrument signed by both parties, except that the Processor
                    may update the technical and organizational measures described in
                    Section 7 from time to time to reflect improvements, provided that such
                    updates do not materially reduce the overall level of security.
                </p>
                <p className={cls.text}>
                    <strong>15.5 Severability.</strong> If any provision of this DPA is found
                    to be invalid or unenforceable, the remaining provisions shall remain in
                    full force and effect.
                </p>
                <p className={cls.text}>
                    <strong>15.6 Force Majeure.</strong> Neither party shall be liable for
                    delays or failures in performance resulting from causes beyond its
                    reasonable control, including acts of God, natural disasters,
                    governmental actions, widespread infrastructure failures, pandemics,
                    or cyberattacks affecting critical infrastructure, provided that:
                    (a) the affected party promptly notifies the other party in writing;
                    (b) the affected party uses commercially reasonable efforts to resume
                    performance; and (c) this clause shall not excuse obligations related
                    to data security, breach notification, or the confidentiality of
                    Personal Data.
                </p>
                <p className={cls.text}>
                    <strong>15.7 Entire DPA.</strong> This DPA, together with the Agreement,
                    the SCCs, and any annexes hereto, constitutes the entire agreement between
                    the parties with respect to the Processing of Personal Data.
                </p>
            </section>

            {/* §16 — US PRIVACY LAW ADDENDUM */}
            <section className={cls.section}>
                <h2 className={cls.sectionTitle}>
                    16. Additional Terms for US Privacy Laws
                </h2>
                <p className={cls.text}>
                    To the extent that the Processing of Personal Data is subject to the
                    California Consumer Privacy Act (CCPA/CPRA), Virginia Consumer Data
                    Protection Act (VCDPA), Colorado Privacy Act (CPA), Connecticut Data
                    Privacy Act (CTDPA), Texas Data Privacy and Security Act (TDPSA), or
                    other applicable US state privacy laws, the following additional terms
                    shall apply:
                </p>
                <ul className={cls.list}>
                    <li>
                        <strong>Service Provider Certification.</strong> The Processor
                        certifies that it is a &quot;service provider&quot; (as defined
                        under CCPA) or &quot;processor&quot; (as defined under applicable
                        state law) with respect to the Controller&#39;s Personal Data.
                        The Processor shall process Personal Data only on behalf of and
                        pursuant to the Controller&#39;s instructions.
                    </li>
                    <li>
                        <strong>No Sale or Sharing.</strong> The Processor shall{' '}
                        <strong>not</strong> sell, share, or disclose Personal Data for
                        purposes of cross-context behavioral advertising or any purpose
                        other than providing the Services. The Processor shall not combine
                        Personal Data received from the Controller with Personal Data
                        received from other sources, except as permitted by CCPA.
                    </li>
                    <li>
                        <strong>Compliance Assistance.</strong> The Processor shall,
                        upon reasonable request, assist the Controller in responding
                        to consumer requests under CCPA (e.g., right to know, right to
                        delete, right to opt-out) and comparable requests under other
                        state privacy laws.
                    </li>
                    <li>
                        <strong>Data Retention.</strong> The Processor shall retain
                        Personal Data only for as long as necessary to fulfill the
                        purposes specified in Section 3, unless a longer retention period
                        is required by applicable law.
                    </li>
                    <li>
                        <strong>Notification of Inability to Comply.</strong> The Processor
                        shall notify the Controller if it determines that it can no longer
                        meet its obligations under applicable US state privacy laws.
                    </li>
                </ul>
            </section>

            {/* §17 — CONTACT */}
            <section className={cls.section}>
                <h2 className={cls.sectionTitle}>17. Contact Information</h2>
                <p className={cls.text}>
                    For questions regarding this DPA, data processing, or to exercise audit
                    rights, please contact:
                </p>
                <address className={cls.address}>
                    <strong>Data Protection Contact</strong><br />
                    Lets Fix LLC<br />
                    Chicago, Illinois, United States<br />
                    Email:{' '}
                    <a href="mailto:privacy@aipbx.net" className={cls.link}>
                        privacy@aipbx.net
                    </a><br />
                    Legal:{' '}
                    <a href="mailto:legal@aipbx.net" className={cls.link}>
                        legal@aipbx.net
                    </a>
                </address>
            </section>
        </article>
    </Page>
))

export default DpaPage
