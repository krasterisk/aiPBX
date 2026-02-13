import { memo } from 'react'
import { Link } from 'react-router-dom'
import { Page } from '@/widgets/Page'
import { getRouteLegal } from '@/shared/const/router'
import cls from './PrivacyPolicyPage.module.scss'

const PrivacyPolicyPage = memo(() => (
    <Page data-testid="PrivacyPolicyPage">
        <article className={cls.document}>
            <Link to={getRouteLegal()} className={cls.backLink}>
                ← Back to Legal
            </Link>

            <header className={cls.header}>
                <h1 className={cls.title}>PRIVACY POLICY</h1>
                <p className={cls.meta}>Effective Date: February 13, 2026</p>
                <p className={cls.meta}>Last Updated: February 13, 2026</p>
            </header>

            <p className={cls.intro}>
                Lets Fix LLC (&quot;Company,&quot; &quot;we,&quot; &quot;us,&quot; or
                &quot;our&quot;), a limited liability company organized under the laws of
                the State of Illinois, operates the AI-powered voice bot platform accessible
                at{' '}
                <a href="https://aipbx.net" className={cls.link} target="_blank" rel="noopener noreferrer">
                    aipbx.net
                </a>{' '}
                (the &quot;Services&quot;). This Privacy Policy describes how we collect,
                use, disclose, and protect personal information when you use our Services.
            </p>
            <p className={cls.intro}>
                This Privacy Policy applies to all users of the Services worldwide,
                including users in the United States and the European Economic Area (EEA).
                If you are located in the EEA, additional rights under the General Data
                Protection Regulation (GDPR) apply to you, as described in Section 9.
                If you are a California resident, the California Consumer Privacy Act
                (CCPA) provides additional rights described in Section 10.
            </p>

            {/* §1 — ROLES & RESPONSIBILITIES */}
            <section className={cls.section}>
                <h2 className={cls.sectionTitle}>
                    1. Data Controller and Data Processor Roles
                </h2>
                <p className={cls.text}>
                    <strong>When We Act as Data Controller.</strong> We are the data controller
                    (as defined under GDPR) for personal data we collect directly from you
                    when you create an account, visit our website, contact support, or pay
                    for the Services (see Section 2.1 — Account Data below). As data
                    controller, we determine the purposes and means of processing this
                    account-level personal data.
                </p>
                <p className={cls.text}>
                    <strong>When We Act as Data Processor.</strong> When our B2B customers
                    use the Services to process calls on behalf of their own end users
                    (call participants), <strong>the customer is the data controller</strong> for
                    the personal data of those call participants, and <strong>we act as the
                        data processor</strong> (or &quot;service provider&quot; under CCPA).
                    In this capacity, we process personal data only in accordance with
                    the customer&#39;s instructions and our{' '}
                    <Link to="/legal/dpa" className={cls.link}>Data Processing Agreement</Link>.
                    The Company <strong>does not determine the purposes and means</strong> of
                    processing call participant data — such decisions are made solely by
                    the Customer.
                </p>
                <p className={cls.text}>
                    <strong>No Independent Collection of Call Participant Data.</strong>{' '}
                    The Company does not collect, use, or retain personal data of call
                    participants for its own purposes. All transcripts, AI-generated
                    responses, and call-related data are processed <strong>solely on
                        behalf of the Customer</strong> and in accordance with the
                    Customer&#39;s documented instructions. The Company does not
                    independently determine the purposes or means of processing
                    call participant data.
                </p>
                <p className={cls.text}>
                    <strong>Limitation of Processor Liability.</strong> When acting as a
                    data processor, we shall not be liable for the lawfulness of
                    the customer&#39;s processing instructions, the customer&#39;s
                    compliance with applicable data protection laws, or the accuracy,
                    quality, or legality of the personal data provided to us by the
                    customer. The customer, as data controller, remains solely
                    responsible for: (a) ensuring a valid legal basis for all processing;
                    (b) providing required notices and obtaining consents from data
                    subjects; (c) responding to data subject requests; and (d) compliance
                    with all applicable data protection laws in connection with the
                    personal data processed through the Services.
                </p>
                <p className={cls.text}>
                    If you are a call participant and have questions about how your personal
                    data is processed, please contact the business that initiated the call,
                    as they are the data controller for your information.
                </p>
            </section>

            {/* §2 — CATEGORIES OF DATA */}
            <section className={cls.section}>
                <h2 className={cls.sectionTitle}>
                    2. Categories of Personal Data We Collect
                </h2>
                <p className={cls.text}>
                    We handle two distinct categories of personal data, depending on
                    our role as either <strong>data controller</strong> or{' '}
                    <strong>data processor</strong>:
                </p>

                <h3 className={cls.subsectionTitle}>
                    2.1 Account Data (We Act as Data Controller)
                </h3>
                <p className={cls.text}>
                    We collect the following data directly from you for account
                    registration, billing, authentication, and customer support.
                    We are the <strong>data controller</strong> for this data and
                    determine the purposes and means of its processing.
                </p>
                <ul className={cls.list}>
                    <li>Full name, email address, phone number</li>
                    <li>Company name, job title (for business accounts)</li>
                    <li>Account credentials (hashed passwords, OAuth tokens)</li>
                    <li>Profile preferences and settings</li>
                    <li>Billing address, payment card details (processed by Stripe — we do not store full card numbers)</li>
                    <li>Transaction history, invoice records</li>
                    <li>Subscription plan and usage tier</li>
                    <li>Support requests and correspondence</li>
                </ul>

                <h3 className={cls.subsectionTitle}>
                    2.2 Call Data (We Act as Data Processor)
                </h3>
                <p className={cls.text}>
                    The following data is generated or processed during calls made
                    through the Services. The <strong>Customer is the data
                        controller</strong> for this data, and we process it{' '}
                    <strong>solely on behalf of the Customer</strong> in accordance
                    with their instructions and our{' '}
                    <Link to="/legal/dpa" className={cls.link}>Data Processing Agreement</Link>.
                </p>
                <ul className={cls.list}>
                    <li>Real-time voice audio processed for speech-to-text transcription (not recorded or stored as audio)</li>
                    <li>Transcripts generated by our speech-to-text system</li>
                    <li>AI-generated responses and conversation logs</li>
                    <li>Caller and callee phone numbers</li>
                    <li>Call duration, timestamps, call direction (inbound/outbound)</li>
                    <li>SIP/PBX connection data</li>
                </ul>

                <h3 className={cls.subsectionTitle}>2.3 Technical and Usage Data</h3>
                <p className={cls.text}>
                    We collect limited technical data necessary to operate, secure, and
                    improve the Services. This data is <strong>not</strong> used to
                    identify individual call participants.
                </p>
                <ul className={cls.list}>
                    <li>IP address, browser type, operating system, device information</li>
                    <li>Pages visited, features used, session duration</li>
                    <li>Error logs, performance data, system logs</li>
                    <li>Cookies and similar tracking technologies (see Section 12)</li>
                </ul>
                <p className={cls.text}>
                    <strong>Data Accuracy.</strong> We rely on the accuracy of personal
                    data provided by you and, where applicable, by the data controller
                    on whose behalf we process data. We are not responsible for
                    verifying the accuracy, completeness, or legality of the personal
                    data provided to us, and we expressly disclaim all liability arising
                    from inaccurate, incomplete, or unlawfully obtained personal data.
                </p>
            </section>

            {/* §3 — PURPOSES */}
            <section className={cls.section}>
                <h2 className={cls.sectionTitle}>3. Purposes of Processing</h2>
                <p className={cls.text}>
                    We process personal data for the following purposes:
                </p>

                <div className={cls.table}>
                    <div className={cls.tableHeader}>
                        <span>Purpose</span>
                        <span>Data Categories</span>
                    </div>
                    <div className={cls.tableRow}>
                        <span>Providing and operating the Services</span>
                        <span>Account, Voice, Call Metadata, Technical</span>
                    </div>
                    <div className={cls.tableRow}>
                        <span>Processing payments and billing</span>
                        <span>Payment, Account</span>
                    </div>
                    <div className={cls.tableRow}>
                        <span>AI-powered voice transcription and response generation</span>
                        <span>Voice, Call Metadata</span>
                    </div>
                    <div className={cls.tableRow}>
                        <span>Customer support and communication</span>
                        <span>Account, Technical</span>
                    </div>
                    <div className={cls.tableRow}>
                        <span>Security, fraud detection, and abuse prevention</span>
                        <span>Account, Technical, Call Metadata</span>
                    </div>
                    <div className={cls.tableRow}>
                        <span>Improving and developing the Services</span>
                        <span>Technical, Usage (anonymized/aggregated)</span>
                    </div>
                    <div className={cls.tableRow}>
                        <span>Legal compliance and regulatory obligations</span>
                        <span>All categories as necessary</span>
                    </div>
                    <div className={cls.tableRow}>
                        <span>Analytics and performance monitoring</span>
                        <span>Technical, Usage</span>
                    </div>
                </div>
                <p className={cls.text}>
                    <strong>No AI Model Training.</strong> We do <strong>not</strong> use
                    your personal data, voice data, transcripts, or conversation logs to
                    train, fine-tune, or improve our AI or machine learning models. Voice
                    audio is processed in real-time for transcription purposes only and is
                    not stored as audio after processing. We do not create voiceprints or
                    biometric identifiers from voice data.
                </p>
                <p className={cls.text}>
                    <strong>Data Minimization for Call Content.</strong> The Company
                    follows a strict data minimization principle with respect to call
                    content. We do <strong>not</strong> use call content, transcripts,
                    or conversation logs for profiling, marketing, behavioral
                    advertising, or independent analytics purposes. Call-related data
                    is processed exclusively to provide the Services on behalf of the
                    Customer and is not used by the Company for any secondary purpose
                    without the Customer&#39;s explicit written authorization.
                </p>
                <p className={cls.text}>
                    <strong>Automated Decision-Making.</strong> The Services use AI and
                    machine learning systems to generate real-time voice responses during
                    calls. These automated systems do not make decisions that produce legal
                    effects or similarly significantly affect individuals. The AI-generated
                    responses are conversational in nature and do not constitute binding
                    decisions, professional advice, or legal determinations. If you believe
                    an automated decision has significantly affected you, contact us at{' '}
                    <a href="mailto:privacy@aipbx.net" className={cls.link}>
                        privacy@aipbx.net
                    </a>{' '}
                    to request human review.
                </p>
            </section>

            {/* §4 — LEGAL BASIS (GDPR) */}
            <section className={cls.section}>
                <h2 className={cls.sectionTitle}>
                    4. Legal Basis for Processing (GDPR)
                </h2>
                <p className={cls.text}>
                    If you are located in the EEA, we process your personal data based on
                    the following legal grounds under Articles 6 and 9 of the GDPR:
                </p>
                <ul className={cls.list}>
                    <li>
                        <strong>Performance of a Contract</strong> (Art. 6(1)(b)) — Processing
                        necessary to provide you with the Services, manage your account, and
                        process payments.
                    </li>
                    <li>
                        <strong>Legitimate Interests</strong> (Art. 6(1)(f)) — Processing
                        necessary for our legitimate interests, such as improving the Services,
                        preventing fraud, ensuring security, and conducting analytics, where
                        these interests are not overridden by your rights.
                    </li>
                    <li>
                        <strong>Consent</strong> (Art. 6(1)(a)) — Where you have given explicit
                        consent, such as for marketing communications or optional data sharing.
                        You may withdraw consent at any time without affecting the lawfulness
                        of processing performed prior to withdrawal.
                    </li>
                    <li>
                        <strong>Legal Obligation</strong> (Art. 6(1)(c)) — Processing necessary
                        to comply with applicable laws, such as tax reporting, anti-money
                        laundering, or responding to legal process.
                    </li>
                </ul>
            </section>

            {/* §5 — DATA RETENTION */}
            <section className={cls.section}>
                <h2 className={cls.sectionTitle}>5. Data Retention Periods</h2>
                <p className={cls.text}>
                    We retain personal data only as long as necessary for the purposes
                    described in this Privacy Policy, unless a longer retention period is
                    required by law. Specific retention periods are as follows:
                </p>

                <div className={cls.table}>
                    <div className={cls.tableHeader}>
                        <span>Data Category</span>
                        <span>Retention Period</span>
                    </div>
                    <div className={cls.tableRow}>
                        <span>Account data</span>
                        <span>Duration of account + 30 days after termination</span>
                    </div>
                    <div className={cls.tableRow}>
                        <span>Transcripts &amp; AI-generated content</span>
                        <span>Duration of account + 30 days after termination</span>
                    </div>
                    <div className={cls.tableRow}>
                        <span>Call metadata</span>
                        <span>Duration of account + 90 days after termination</span>
                    </div>
                    <div className={cls.tableRow}>
                        <span>Payment and billing records</span>
                        <span>7 years (as required by tax and financial regulations)</span>
                    </div>
                    <div className={cls.tableRow}>
                        <span>Technical/usage logs</span>
                        <span>12 months (then anonymized or deleted)</span>
                    </div>
                    <div className={cls.tableRow}>
                        <span>Support correspondence</span>
                        <span>3 years after resolution</span>
                    </div>
                </div>

                <p className={cls.text}>
                    Upon expiration of the applicable retention period, data is permanently
                    deleted or irreversibly anonymized. We may retain aggregated,
                    de-identified data indefinitely for analytical purposes.
                </p>
                <p className={cls.text}>
                    <strong>Retention Override.</strong> Notwithstanding the retention
                    periods above, we may retain personal data beyond the specified
                    period where required by applicable law, regulation, or legal
                    process, or where necessary to establish, exercise, or defend legal
                    claims.
                </p>
                <p className={cls.text}>
                    <strong>Deletion Requests During Active Accounts.</strong> If you
                    exercise your right to erasure (GDPR Art. 17) or right to delete
                    (CCPA) while your account remains active, we will delete or
                    anonymize the specified data within thirty (30) days, except where
                    retention is required for ongoing service provision, legal
                    obligations, or legitimate business purposes (e.g., billing records,
                    fraud prevention). Deletion of transcripts and conversation logs
                    does not affect previously generated aggregated or anonymized
                    analytics data derived therefrom.
                </p>
            </section>

            {/* §6 — INTERNATIONAL TRANSFERS */}
            <section className={cls.section}>
                <h2 className={cls.sectionTitle}>6. International Data Transfers</h2>
                <p className={cls.text}>
                    Our Services are hosted in the United States. If you access the Services
                    from outside the US, including from the European Economic Area (EEA),
                    the United Kingdom, or Switzerland, your personal data will be
                    transferred to and processed in the United States.
                </p>
                <p className={cls.text}>
                    For transfers of personal data from the EEA, UK, or Switzerland to
                    the US, we rely on the following transfer mechanisms to ensure an
                    adequate level of protection:
                </p>
                <ul className={cls.list}>
                    <li>
                        <strong>Standard Contractual Clauses (SCCs)</strong> — We execute
                        EU-approved Standard Contractual Clauses with our customers and
                        subprocessors to provide appropriate safeguards for cross-border
                        data transfers (Commission Implementing Decision (EU) 2021/914).
                        For UK transfers, we use the UK International Data Transfer
                        Agreement (IDTA) or UK Addendum to the EU SCCs, as applicable.
                    </li>
                    <li>
                        <strong>EU-US Data Privacy Framework</strong> — Where applicable,
                        we may rely on the EU-US Data Privacy Framework, the UK Extension,
                        and/or the Swiss-US Data Privacy Framework for certified transfers.
                    </li>
                    <li>
                        <strong>Transfer Impact Assessment</strong> — We have conducted a
                        transfer impact assessment in accordance with the requirements of
                        the <em>Schrems II</em> decision (Case C-311/18) and maintain
                        supplementary technical and organizational measures, including
                        encryption in transit and at rest, access controls, and data
                        minimization, to ensure an essentially equivalent level of
                        protection.
                    </li>
                </ul>
                <p className={cls.text}>
                    <strong>Your Acknowledgment.</strong> By using the Services from
                    outside the United States, you acknowledge and consent to the
                    transfer of your personal data to the United States and the
                    application of United States law to such data, subject to the
                    safeguards described above.
                </p>
            </section>

            {/* §7 — SUBPROCESSORS */}
            <section className={cls.section}>
                <h2 className={cls.sectionTitle}>7. Subprocessors</h2>
                <p className={cls.text}>
                    We engage the following categories of third-party subprocessors to help
                    provide our Services. Each subprocessor processes personal data only as
                    necessary to perform its designated function and is bound by data
                    processing agreements that require GDPR-equivalent protections:
                </p>

                <div className={cls.table}>
                    <div className={cls.tableHeader}>
                        <span>Subprocessor Category</span>
                        <span>Purpose</span>
                        <span>Location</span>
                    </div>
                    <div className={cls.tableRow}>
                        <span>Cloud Infrastructure Provider</span>
                        <span>Hosting, storage, compute</span>
                        <span>United States</span>
                    </div>
                    <div className={cls.tableRow}>
                        <span>Stripe, Inc.</span>
                        <span>Payment processing</span>
                        <span>United States</span>
                    </div>
                    <div className={cls.tableRow}>
                        <span>AI/ML Service Provider</span>
                        <span>Speech-to-text, AI response generation</span>
                        <span>United States</span>
                    </div>
                    <div className={cls.tableRow}>
                        <span>SIP/PBX Infrastructure</span>
                        <span>Voice call routing and connectivity</span>
                        <span>United States / varies</span>
                    </div>
                    <div className={cls.tableRow}>
                        <span>Email Service Provider</span>
                        <span>Transactional and support emails</span>
                        <span>United States</span>
                    </div>
                    <div className={cls.tableRow}>
                        <span>Analytics Provider</span>
                        <span>Usage analytics and performance monitoring</span>
                        <span>United States</span>
                    </div>
                </div>

                <p className={cls.text}>
                    We will notify customers of any changes to subprocessors at least
                    fifteen (15) days in advance, providing an opportunity to object.
                    If you object to a new subprocessor on reasonable data protection
                    grounds, we will discuss the concern in good faith. If no resolution
                    is reached within thirty (30) days, you may terminate the affected
                    Services without penalty.
                    A current, detailed list of subprocessors is available upon request
                    at{' '}
                    <a href="mailto:privacy@aipbx.net" className={cls.link}>
                        privacy@aipbx.net
                    </a>.
                </p>
                <p className={cls.text}>
                    <strong>Subprocessor Liability.</strong> While we impose contractual
                    data protection obligations on all subprocessors equivalent to those
                    in this Privacy Policy, we shall not be liable for the independent
                    actions of subprocessors that are beyond our reasonable control,
                    including unauthorized processing, security breaches at the
                    subprocessor level, or subprocessor insolvency, to the extent such
                    actions occur despite our commercially reasonable due diligence and
                    oversight.
                </p>
            </section>

            {/* §8 — SECURITY */}
            <section className={cls.section}>
                <h2 className={cls.sectionTitle}>8. Security Measures</h2>
                <p className={cls.text}>
                    We implement appropriate technical and organizational measures designed
                    to protect personal data against unauthorized access, alteration,
                    disclosure, or destruction. These measures include:
                </p>
                <ul className={cls.list}>
                    <li>
                        <strong>Encryption:</strong> Data encrypted in transit (TLS 1.2+)
                        and at rest (AES-256).
                    </li>
                    <li>
                        <strong>Access Controls:</strong> Role-based access control (RBAC),
                        least-privilege principles, multi-factor authentication (MFA) for
                        administrative access.
                    </li>
                    <li>
                        <strong>Infrastructure Security:</strong> Firewalls, intrusion
                        detection systems, regular vulnerability assessments.
                    </li>
                    <li>
                        <strong>Data Minimization:</strong> We collect and process only the
                        personal data necessary for the specified purposes.
                    </li>
                    <li>
                        <strong>Employee Training:</strong> Regular security awareness
                        training for all personnel with access to personal data.
                    </li>
                    <li>
                        <strong>Incident Response:</strong> Documented incident response
                        procedures with breach notification within 72 hours as required
                        by applicable law.
                    </li>
                </ul>
                <p className={cls.text}>
                    While we take reasonable measures to protect your data, no method of
                    transmission over the Internet or electronic storage is 100% secure.
                    We cannot guarantee absolute security. <strong>The Company shall not
                        be liable for any unauthorized access, breach, or compromise of
                        personal data except to the extent directly caused by our failure
                        to implement the security measures described in this Section 8.</strong>
                </p>
                <p className={cls.text}>
                    <strong>Breach Notification to Individuals.</strong> Where a data
                    breach is likely to result in a high risk to the rights and freedoms
                    of individuals (as required by GDPR Art. 34), we will notify affected
                    data subjects without undue delay. For breaches affecting US residents,
                    we will comply with all applicable state breach notification laws,
                    which may require notification within varying timeframes depending
                    on your state of residence.
                </p>
            </section>

            {/* §9 — DATA SUBJECT RIGHTS (GDPR) */}
            <section className={cls.section}>
                <h2 className={cls.sectionTitle}>
                    9. Data Subject Rights (EEA Residents — GDPR)
                </h2>
                <p className={cls.text}>
                    If you are located in the European Economic Area, you have the following
                    rights under the GDPR. To exercise these rights, contact us at{' '}
                    <a href="mailto:privacy@aipbx.net" className={cls.link}>
                        privacy@aipbx.net
                    </a>:
                </p>
                <ul className={cls.list}>
                    <li>
                        <strong>Right of Access</strong> (Art. 15) — Request a copy of the
                        personal data we hold about you.
                    </li>
                    <li>
                        <strong>Right to Rectification</strong> (Art. 16) — Request correction
                        of inaccurate or incomplete personal data.
                    </li>
                    <li>
                        <strong>Right to Erasure</strong> (Art. 17) — Request deletion of your
                        personal data, subject to legal retention obligations.
                    </li>
                    <li>
                        <strong>Right to Restriction</strong> (Art. 18) — Request restriction
                        of processing in certain circumstances.
                    </li>
                    <li>
                        <strong>Right to Data Portability</strong> (Art. 20) — Receive your
                        personal data in a structured, commonly used, machine-readable format.
                    </li>
                    <li>
                        <strong>Right to Object</strong> (Art. 21) — Object to processing
                        based on legitimate interests, including profiling.
                    </li>
                    <li>
                        <strong>Right to Withdraw Consent</strong> (Art. 7(3)) — Withdraw
                        consent at any time for processing based on consent, without affecting
                        the lawfulness of prior processing.
                    </li>
                    <li>
                        <strong>Right to Lodge a Complaint</strong> — File a complaint with
                        your local data protection supervisory authority.
                    </li>
                </ul>
                <p className={cls.text}>
                    We will respond to your request within thirty (30) days. If we need
                    additional time (up to an additional sixty (60) days for complex
                    requests), we will inform you and provide an explanation. We may
                    charge a reasonable fee or refuse to act on manifestly unfounded
                    or excessive requests (Art. 12(5) GDPR).
                </p>
                <p className={cls.text}>
                    <strong>Identity Verification.</strong> We may require you to verify
                    your identity before processing any data subject request. We reserve
                    the right to decline requests where we cannot reasonably verify
                    the identity of the requester, in order to protect the privacy
                    and security of all data subjects.
                </p>
                <p className={cls.text}>
                    <strong>Automated Decision-Making Rights.</strong> Pursuant to
                    Article 22 GDPR, you have the right not to be subject to a decision
                    based solely on automated processing that produces legal effects
                    or similarly significantly affects you. As described in Section 3,
                    our AI systems generate conversational responses and do not make
                    decisions that produce legal effects. You may contact us to request
                    information about the logic involved in any automated processing.
                </p>
                <p className={cls.text}>
                    <strong>Note for Call Participants:</strong> If you are a participant in
                    a call processed through our platform and wish to exercise your GDPR
                    rights, please contact the business that initiated the call (the data
                    controller). We will assist the controller in fulfilling your request
                    in accordance with our Data Processing Agreement.
                </p>
            </section>

            {/* §10 — CCPA RIGHTS */}
            <section className={cls.section}>
                <h2 className={cls.sectionTitle}>
                    10. California Consumer Rights (CCPA/CPRA)
                </h2>
                <p className={cls.text}>
                    If you are a California resident, the California Consumer Privacy Act
                    (CCPA), as amended by the California Privacy Rights Act (CPRA), provides
                    you with the following rights:
                </p>
                <ul className={cls.list}>
                    <li>
                        <strong>Right to Know:</strong> You may request that we disclose the
                        categories and specific pieces of personal information we have collected
                        about you, the categories of sources, the business purpose for
                        collection, and the categories of third parties with whom we share it.
                    </li>
                    <li>
                        <strong>Right to Delete:</strong> You may request deletion of personal
                        information we have collected, subject to certain exceptions (e.g.,
                        legal obligations, ongoing transactions).
                    </li>
                    <li>
                        <strong>Right to Correct:</strong> You may request correction of
                        inaccurate personal information.
                    </li>
                    <li>
                        <strong>Right to Opt-Out of Sale/Sharing:</strong> We do not sell
                        personal information and do not share personal information for
                        cross-context behavioral advertising purposes.
                    </li>
                    <li>
                        <strong>Right to Non-Discrimination:</strong> We will not discriminate
                        against you for exercising your CCPA rights.
                    </li>
                    <li>
                        <strong>Right to Limit Use of Sensitive Personal Information:</strong>{' '}
                        You may dirеct us to limit the use of sensitive personal information
                        to purposes necessary to provide the Services.
                    </li>
                </ul>
                <p className={cls.text}>
                    To exercise these rights, contact us at{' '}
                    <a href="mailto:privacy@aipbx.net" className={cls.link}>
                        privacy@aipbx.net
                    </a>{' '}
                    or call us. We will verify your identity before processing your request.
                    You may designate an authorized agent to make a request on your behalf.
                    We will respond within forty-five (45) days, with an option to extend
                    by an additional forty-five (45) days with notice.
                </p>
                <p className={cls.text}>
                    <strong>Sensitive Personal Information.</strong> The following
                    categories of sensitive personal information may be processed
                    through the Services: (a) account credentials (passwords, OAuth
                    tokens); and (b) contents of communications (call transcripts,
                    AI-generated responses). This sensitive personal information
                    is used only as necessary to provide the Services and is not used
                    for purposes of inferring characteristics about you.
                </p>
                <p className={cls.text}>
                    <strong>Financial Incentives.</strong> We do not offer financial
                    incentives or price differences in exchange for personal information.
                </p>
                <p className={cls.text}>
                    <strong>Other State Privacy Laws.</strong> Residents of Virginia
                    (VCDPA), Colorado (CPA), Connecticut (CTDPA), Texas (TDPSA),
                    Oregon (OCPA), and other states with comprehensive privacy laws
                    may have similar rights to those described in this Section 10.
                    To exercise any rights available under your state&#39;s privacy
                    law, contact us at{' '}
                    <a href="mailto:privacy@aipbx.net" className={cls.link}>
                        privacy@aipbx.net
                    </a>.
                    We will process your request in accordance with applicable law.
                </p>
            </section>

            {/* §11 — CHILDREN'S DATA */}
            <section className={cls.section}>
                <h2 className={cls.sectionTitle}>11. Children&#39;s Privacy</h2>
                <p className={cls.text}>
                    The Services are not intended for use by individuals under the age of
                    sixteen (16). We do not knowingly collect personal data from children
                    under 16. If you are under 16, please do not use the Services or
                    provide any personal information.
                </p>
                <p className={cls.text}>
                    If we become aware that we have inadvertently collected personal data
                    from a child under 16, we will take reasonable steps to delete such
                    data promptly. If you believe that a child under 16 has provided us
                    with personal data, please contact us at{' '}
                    <a href="mailto:privacy@aipbx.net" className={cls.link}>
                        privacy@aipbx.net
                    </a>.
                </p>
                <p className={cls.text}>
                    For US users under the Children&#39;s Online Privacy Protection Act
                    (COPPA), the minimum age is thirteen (13). We do not knowingly collect
                    personal information from children under 13.
                </p>
                <p className={cls.text}>
                    <strong>Age Representation.</strong> By using the Services, you
                    represent and warrant that you are at least sixteen (16) years of
                    age (or thirteen (13) years of age in jurisdictions where COPPA
                    applies and parental consent has been obtained). If we discover
                    that you have provided false age information, we reserve the right
                    to immediately terminate your account and delete all associated data.
                </p>
            </section>

            {/* §12 — COOKIES */}
            <section className={cls.section}>
                <h2 className={cls.sectionTitle}>12. Cookies and Tracking Technologies</h2>
                <p className={cls.text}>
                    We use cookies and similar tracking technologies to operate, secure,
                    and improve the Services. The types of cookies we use include:
                </p>
                <ul className={cls.list}>
                    <li>
                        <strong>Strictly Necessary Cookies:</strong> Essential for the
                        operation of the Services (e.g., authentication, security). These
                        cookies cannot be disabled.
                    </li>
                    <li>
                        <strong>Functional Cookies:</strong> Remember your preferences and
                        settings (e.g., language, timezone).
                    </li>
                    <li>
                        <strong>Analytics Cookies:</strong> Help us understand how users
                        interact with the Services to improve performance and user experience.
                        These cookies collect aggregated, anonymized information.
                    </li>
                </ul>
                <p className={cls.text}>
                    We do <strong>not</strong> use advertising or third-party tracking cookies
                    for behavioral advertising purposes.
                </p>
                <p className={cls.text}>
                    <strong>Managing Cookies.</strong> You can manage cookie preferences
                    through your browser settings. Disabling certain cookies may affect the
                    functionality of the Services. For EEA users, we obtain consent before
                    placing non-essential cookies, in accordance with the ePrivacy Directive.
                </p>
                <p className={cls.text}>
                    <strong>Do Not Track Signals.</strong> Some browsers transmit
                    &quot;Do Not Track&quot; (DNT) signals. Currently, the Services do
                    not respond to DNT browser signals, as there is no industry-standard
                    technology for recognizing or honoring DNT signals. We will update
                    this policy if and when a standard is established.
                </p>
            </section>

            {/* §13 — INFORMATION SHARING */}
            <section className={cls.section}>
                <h2 className={cls.sectionTitle}>
                    13. How We Share Personal Information
                </h2>
                <p className={cls.text}>
                    We do not sell your personal information. We share personal data only
                    in the following circumstances:
                </p>
                <ul className={cls.list}>
                    <li>
                        <strong>Service Providers / Subprocessors:</strong> With third-party
                        vendors who process data on our behalf to provide the Services (see
                        Section 7), bound by contractual obligations of confidentiality and
                        data protection.
                    </li>
                    <li>
                        <strong>Professional Advisors:</strong> With our attorneys, auditors,
                        accountants, and other professional advisors in connection with
                        legal, tax, or regulatory compliance, subject to professional
                        obligations of confidentiality.
                    </li>
                    <li>
                        <strong>Legal Requirements:</strong> When required by law, court order,
                        subpoena, or governmental request, or when we believe in good faith
                        that disclosure is necessary to: (a) protect our rights, property,
                        or safety; (b) protect your safety or the safety of others;
                        (c) investigate fraud or respond to a government request;
                        (d) comply with applicable law or legal process; or (e) enforce
                        our Terms of Service.
                    </li>
                    <li>
                        <strong>Business Transfers:</strong> In connection with a merger,
                        acquisition, reorganization, bankruptcy, or sale of all or a portion
                        of our assets, your data may be transferred to the acquiring entity.
                        We will provide notice before your personal data is transferred and
                        becomes subject to a different privacy policy.
                    </li>
                    <li>
                        <strong>Affiliates:</strong> With our parent companies,
                        subsidiaries, and affiliates for internal business purposes,
                        subject to the protections described in this Privacy Policy.
                    </li>
                    <li>
                        <strong>With Your Consent:</strong> When you expressly consent to
                        sharing your data with a specific third party.
                    </li>
                </ul>
                <p className={cls.text}>
                    <strong>No Sale of Personal Data.</strong> We do <strong>not</strong>{' '}
                    sell your personal information, and we do not share it for
                    cross-context behavioral advertising purposes. We have not sold
                    personal information in the preceding twelve (12) months.
                </p>
            </section>

            {/* §14 — CHANGES */}
            <section className={cls.section}>
                <h2 className={cls.sectionTitle}>
                    14. Changes to This Privacy Policy
                </h2>
                <p className={cls.text}>
                    We may update this Privacy Policy from time to time to reflect
                    changes in our practices, technology, legal requirements, or other
                    factors. For material changes, we will provide at least thirty
                    (30) days&#39; advance notice via email or through a prominent
                    notice on our website before the changes take effect.
                </p>
                <p className={cls.text}>
                    <strong>For US Users:</strong> Your continued use of the Services
                    after the effective date of any changes constitutes acceptance of
                    the updated Privacy Policy. If you do not agree with the changes,
                    you must discontinue use of the Services before the effective date.
                </p>
                <p className={cls.text}>
                    <strong>For EEA/UK Users:</strong> Where material changes affect
                    the legal basis or purposes of processing, we will seek your
                    affirmative consent before applying the updated Privacy Policy to
                    your personal data, where required by GDPR.
                </p>
            </section>

            {/* §15 — CONTACT */}
            <section className={cls.section}>
                <h2 className={cls.sectionTitle}>
                    15. Contact Information for Privacy Requests
                </h2>
                <p className={cls.text}>
                    If you have questions about this Privacy Policy, wish to exercise your
                    data subject rights, or need to report a privacy concern, please
                    contact us:
                </p>
                <address className={cls.address}>
                    <strong>Privacy Inquiries</strong><br />
                    Lets Fix LLC<br />
                    Chicago, Illinois, United States<br />
                    Privacy:{' '}
                    <a href="mailto:privacy@aipbx.net" className={cls.link}>
                        privacy@aipbx.net
                    </a><br />
                    Legal:{' '}
                    <a href="mailto:legal@aipbx.net" className={cls.link}>
                        legal@aipbx.net
                    </a><br />
                    General:{' '}
                    <a href="mailto:info@aipbx.net" className={cls.link}>
                        info@aipbx.net
                    </a>
                </address>
                <p className={cls.text}>
                    <strong>Response Timeframes.</strong> We aim to respond to all
                    privacy inquiries within ten (10) business days. Data subject
                    rights requests will be processed within the timeframes specified
                    in Sections 9 and 10.
                </p>
                <p className={cls.text}>
                    For GDPR-related inquiries, EEA residents may also lodge a complaint
                    with their local data protection supervisory authority. A list of
                    EU/EEA supervisory authorities is available at{' '}
                    <a
                        href="https://edpb.europa.eu/about-edpb/about-edpb/members_en"
                        className={cls.link}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        edpb.europa.eu
                    </a>.
                </p>
            </section>
        </article>
    </Page>
))

export default PrivacyPolicyPage
