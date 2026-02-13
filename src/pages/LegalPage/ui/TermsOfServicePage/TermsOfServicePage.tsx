import { memo } from 'react'
import { Link } from 'react-router-dom'
import { Page } from '@/widgets/Page'
import { getRouteLegal } from '@/shared/const/router'
import cls from './TermsOfServicePage.module.scss'

const TermsOfServicePage = memo(() => (
    <Page data-testid="TermsOfServicePage">
        <article className={cls.document}>
            <Link to={getRouteLegal()} className={cls.backLink}>
                ← Back to Legal
            </Link>

            <header className={cls.header}>
                <h1 className={cls.title}>TERMS OF SERVICE</h1>
                <p className={cls.meta}>Effective Date: February 13, 2026</p>
                <p className={cls.meta}>Last Updated: February 13, 2026</p>
            </header>

            <p className={cls.intro}>
                These Terms of Service (these &quot;Terms&quot;) constitute a binding legal
                agreement between Lets Fix LLC, a limited liability company organized under the
                laws of the State of Illinois (&quot;Company,&quot; &quot;we,&quot; &quot;us,&quot;
                or &quot;our&quot;), and the customer entity or individual executing an order form
                or using the Services (&quot;Customer&quot; or &quot;you&quot;).
            </p>
            <p className={cls.intro}>
                <strong>
                    BY CREATING AN ACCOUNT, CLICKING &quot;I AGREE,&quot; OR OTHERWISE ACCESSING
                    OR USING THE SERVICES, YOU ACKNOWLEDGE THAT YOU HAVE READ, UNDERSTOOD, AND
                    AGREE TO BE BOUND BY THESE TERMS. IF YOU DO NOT AGREE, DO NOT USE THE SERVICES.
                </strong>
                {' '}If you are entering into these Terms on behalf of an organization, you
                represent and warrant that you have the authority to bind that organization to
                these Terms.
            </p>

            {/* §1 — SERVICES */}
            <section className={cls.section}>
                <h2 className={cls.sectionTitle}>1. Services</h2>
                <p className={cls.text}>
                    We provide a SaaS AI voice bot platform that handles inbound and outbound
                    calls, integrates with SIP/PBX systems, performs speech-to-text transcription,
                    generates AI responses, and optionally records calls (the &quot;Services&quot;).
                    The Services are accessed via our website at{' '}
                    <a href="https://aipbx.net" className={cls.link} target="_blank" rel="noopener noreferrer">
                        aipbx.net
                    </a>.
                </p>
                <p className={cls.text}>
                    <strong>Right to Modify.</strong> We reserve the right, in our sole
                    discretion, to modify, update, replace, or discontinue any feature,
                    functionality, integration, or component of the Services at any time,
                    with or without notice. While we will use commercially reasonable
                    efforts to notify you of material changes, no modification shall
                    constitute a breach of these Terms or give rise to any claim for
                    damages. Your continued use of the Services after any modification
                    constitutes your acceptance thereof.
                </p>
                <p className={cls.text}>
                    <strong>Service Availability.</strong> The Services are provided on an
                    &quot;as available&quot; basis. We do not guarantee any specific level of
                    uptime, availability, throughput, latency, or data processing capacity
                    unless expressly stated in a separate, mutually executed Service Level
                    Agreement (&quot;SLA&quot;). Without a separate SLA, you acknowledge
                    that the Services may experience downtime (planned or unplanned), and
                    the Company shall have no liability for any interruption, suspension,
                    or degradation of service quality.
                </p>
                <p className={cls.text}>
                    <strong>Beta and Experimental Features.</strong> We may offer features
                    designated as &quot;beta,&quot; &quot;preview,&quot; &quot;experimental,&quot;
                    or similar. Such features are provided for evaluation purposes only,
                    may not be fully tested, may contain bugs or errors, and may be
                    modified or discontinued at any time without notice. Beta features are
                    provided &quot;AS IS&quot; without any warranty of any kind, and we
                    shall have no liability for any losses arising from your use of or
                    reliance on beta features.
                </p>
            </section>

            {/* §2 — DISCLAIMER OF WARRANTIES */}
            <section className={cls.section}>
                <h2 className={cls.sectionTitle}>2. Disclaimer of Warranties</h2>
                <p className={cls.textUppercase}>
                    THE SERVICES ARE PROVIDED &quot;AS IS,&quot; &quot;AS AVAILABLE,&quot;
                    AND &quot;WITH ALL FAULTS,&quot; WITHOUT WARRANTY OF ANY KIND, EXPRESS,
                    IMPLIED, OR STATUTORY. TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE
                    LAW, THE COMPANY AND ITS AFFILIATES, LICENSORS, AND SERVICE PROVIDERS
                    EXPRESSLY DISCLAIM ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO:
                </p>
                <ul className={cls.list}>
                    <li>
                        IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE,
                        TITLE, AND NON-INFRINGEMENT;
                    </li>
                    <li>
                        WARRANTIES ARISING FROM COURSE OF DEALING, COURSE OF PERFORMANCE,
                        USAGE, OR TRADE PRACTICE;
                    </li>
                    <li>
                        ANY WARRANTY THAT THE SERVICES WILL BE UNINTERRUPTED, TIMELY,
                        ERROR-FREE, SECURE, ACCURATE, RELIABLE, OR FREE OF VIRUSES,
                        MALWARE, OR OTHER HARMFUL COMPONENTS;
                    </li>
                    <li>
                        ANY WARRANTY REGARDING THE ACCURACY, RELIABILITY, COMPLETENESS,
                        TIMELINESS, OR QUALITY OF AI-GENERATED CONTENT, VOICE RESPONSES,
                        TRANSCRIPTIONS, OR CONVERSATIONAL OUTPUTS;
                    </li>
                    <li>
                        ANY WARRANTY THAT THE SERVICES WILL MEET YOUR REQUIREMENTS,
                        EXPECTATIONS, OR INTENDED RESULTS, OR THAT ANY DEFECTS WILL
                        BE CORRECTED;
                    </li>
                    <li>
                        ANY WARRANTY REGARDING THE PRESERVATION, SECURITY, OR INTEGRITY OF
                        CUSTOMER DATA, TRANSCRIPTS, OR ANY OTHER DATA PROCESSED
                        THROUGH THE SERVICES.
                    </li>
                </ul>
                <p className={cls.text}>
                    TO THE EXTENT APPLICABLE, THE COMPANY DISCLAIMS ALL WARRANTIES
                    UNDER THE UNIFORM COMMERCIAL CODE (UCC), INCLUDING UCC §§ 2-312
                    THROUGH 2-318 AND ANY ANALOGOUS STATE STATUTES.
                </p>
                <p className={cls.text}>
                    Some jurisdictions do not allow the exclusion of implied warranties, so
                    the above exclusions may not apply to you. In such jurisdictions, our
                    warranties are limited to the shortest duration and minimum scope
                    permitted by applicable law.
                </p>
            </section>

            {/* §3 — AI-GENERATED CONTENT DISCLAIMER */}
            <section className={cls.section}>
                <h2 className={cls.sectionTitle}>3. AI-Generated Content Disclaimer</h2>
                <p className={cls.text}>
                    Our platform uses artificial intelligence and machine learning technologies
                    to generate voice responses, transcriptions, and conversational outputs.
                    AI technology is inherently probabilistic and may not always produce
                    accurate, complete, or contextually appropriate results. You expressly
                    acknowledge and agree that:
                </p>
                <ul className={cls.list}>
                    <li>
                        AI-generated content may contain errors, omissions, inaccuracies,
                        hallucinations, or contextually inappropriate responses, and the
                        Company makes <strong>no representation or warranty</strong> of any
                        kind regarding the accuracy, reliability, completeness, or
                        appropriateness of AI outputs.
                    </li>
                    <li>
                        <strong>You are solely and exclusively responsible</strong> for
                        reviewing, evaluating, verifying, and validating the accuracy and
                        appropriateness of all AI-generated content before using, relying
                        on, deploying, or distributing it to any third party.
                    </li>
                    <li>
                        The Company shall have <strong>no liability whatsoever</strong> for
                        any decisions made, actions taken, or outcomes resulting from your
                        reliance on AI-generated content, including but not limited to
                        financial losses, reputational harm, regulatory penalties, or
                        damages to third parties.
                    </li>
                    <li>
                        AI-generated content does not constitute advice of any kind (legal,
                        medical, financial, or otherwise) and does not reflect the views,
                        opinions, or endorsements of the Company.
                    </li>
                    <li>
                        You assume all risk associated with the deployment of AI-generated
                        responses in customer-facing or business-critical applications.
                    </li>
                </ul>
                <p className={cls.text}>
                    <strong>Customer Legal Compliance Responsibility.</strong> You are solely
                    responsible for ensuring that your use of AI-generated content and the
                    Services complies with all applicable laws, regulations, industry
                    standards, and contractual obligations, including but not limited to
                    consumer protection laws, advertising regulations, healthcare
                    regulations (HIPAA), financial services regulations, and data
                    protection laws (GDPR, CCPA). The Company does not monitor, audit,
                    or verify your regulatory compliance and disclaims all liability
                    arising from your failure to comply with applicable laws.
                </p>
            </section>

            {/* §4 — NO PROFESSIONAL ADVICE */}
            <section className={cls.section}>
                <h2 className={cls.sectionTitle}>4. No Legal, Medical, or Professional Advice</h2>
                <p className={cls.text}>
                    The Services are not designed, intended, or authorized to provide legal,
                    medical, financial, tax, accounting, or any other professional advice.
                    You expressly acknowledge and agree that:
                </p>
                <ul className={cls.list}>
                    <li>
                        No content generated by the AI constitutes legal, medical, financial,
                        or professional advice, guidance, or recommendation of any kind, and
                        <strong> shall not be relied upon as such under any circumstances</strong>.
                    </li>
                    <li>
                        You are solely responsible for consulting qualified professionals
                        (attorneys, physicians, accountants, compliance officers) for advice
                        specific to your situation, industry, and jurisdiction.
                    </li>
                    <li>
                        Telecommunications laws, including consent requirements for
                        automated calls, vary significantly by jurisdiction. Nothing in these
                        Terms, the Services, or any AI-generated content constitutes legal
                        guidance on regulatory compliance.
                    </li>
                    <li>
                        <strong>You expressly waive any and all claims</strong> against the
                        Company arising from your reliance on AI-generated content as
                        professional advice, including but not limited to claims for
                        negligence, malpractice, or professional liability.
                    </li>
                </ul>
                <p className={cls.text}>
                    <strong>Regulated Industries.</strong> If you operate in a regulated
                    industry (healthcare, financial services, legal services, insurance,
                    emergency services, government), you acknowledge that: (a) the Services
                    are not certified, validated, or approved for use in regulatory
                    compliance contexts; (b) you are solely responsible for ensuring your
                    use of the Services meets all industry-specific regulatory requirements;
                    and (c) the Company shall have no liability for any regulatory
                    violations, penalties, or sanctions arising from your use of the
                    Services in regulated contexts.
                </p>
            </section>

            {/* §5 — TELECOMMUNICATIONS COMPLIANCE */}
            <section className={cls.section}>
                <h2 className={cls.sectionTitle}>
                    5. Telecommunications Compliance
                </h2>
                <p className={cls.text}>
                    <strong>No Call Recording.</strong> The Services do not provide call
                    recording functionality. The Company does not record, store, or retain
                    any audio recordings of calls processed through the Services.
                </p>
                <p className={cls.text}>
                    <strong>Customer Responsibility.</strong> You acknowledge and agree that
                    <strong> you are solely and exclusively responsible</strong> for
                    complying with all applicable federal, state, local, and
                    international telecommunications laws, including obtaining all
                    necessary consents for automated or AI-assisted calls, providing
                    required disclosures and announcements to call participants, and
                    maintaining auditable records of such consents for the duration
                    required by applicable law.
                </p>
                <p className={cls.text}>
                    <strong>TCPA and Telemarketing Compliance.</strong> If you use the Services
                    to make outbound calls, you represent and warrant that:
                </p>
                <ul className={cls.list}>
                    <li>
                        You will comply with the Telephone Consumer Protection Act (TCPA,
                        47 U.S.C. § 227), the Telemarketing Sales Rule (TSR, 16 C.F.R. Part
                        310), and all applicable state, federal, and international
                        telemarketing and do-not-call laws and regulations.
                    </li>
                    <li>
                        You have obtained all required prior express written consent before
                        making any automated or AI-assisted calls, and you maintain
                        contemporaneous, auditable records of all such consents.
                    </li>
                    <li>
                        You maintain and honor applicable do-not-call lists (including the
                        National Do Not Call Registry) and maintain records of consent in
                        accordance with FCC and FTC regulations.
                    </li>
                    <li>
                        You will not use the Services to make any call or send any message
                        that would violate any applicable telecommunications law or regulation.
                    </li>
                </ul>
                <p className={cls.text}>
                    <strong>Acknowledgment of Statutory Damages.</strong> You acknowledge
                    that violations of TCPA and similar telecommunications laws may expose
                    you to <strong>statutory damages of up to $1,500 per violation</strong>{' '}
                    (or the applicable statutory maximum), and that individual violations
                    can aggregate to substantial liability. The Company bears no
                    responsibility for, and shall have no liability arising from, your
                    telecommunications compliance practices.
                </p>
                <p className={cls.text}>
                    <strong>Telecommunications Indemnification.</strong> You shall defend,
                    indemnify, and hold the Company Indemnitees harmless from any and all
                    claims, demands, lawsuits (including class actions and mass
                    arbitrations), damages, penalties, fines, sanctions, settlements, and
                    expenses (including reasonable attorneys&#39; fees, expert witness fees,
                    and regulatory compliance costs) arising from your failure to comply
                    with any telecommunications or consent law, including
                    but not limited to TCPA, TSR, state equivalents, GDPR ePrivacy
                    requirements, and any future telecommunications regulations.
                </p>
            </section>

            {/* §6 — ACCEPTABLE USE */}
            <section className={cls.section}>
                <h2 className={cls.sectionTitle}>6. Acceptable Use Policy</h2>
                <p className={cls.text}>
                    You may not, and may not authorize, permit, or enable any third party
                    to, use the Services to:
                </p>
                <ul className={cls.list}>
                    <li>
                        Engage in illegal activities, fraud, deception, or violations of any
                        applicable law, regulation, or ordinance.
                    </li>
                    <li>
                        Make spam calls, unsolicited robocalls, or telemarketing calls in
                        violation of TCPA, TSR, or applicable state or international laws.
                    </li>
                    <li>Transmit malware, viruses, worms, Trojan horses, or harmful code.</li>
                    <li>
                        Infringe upon intellectual property rights, privacy rights, or
                        publicity rights of others.
                    </li>
                    <li>
                        Interfere with or disrupt the integrity, performance, availability,
                        or security of the Services or any related systems or networks.
                    </li>
                    <li>
                        Attempt to gain unauthorized access to our systems, networks,
                        accounts, or data, including through credential stuffing, brute
                        force, or social engineering.
                    </li>
                    <li>
                        Reverse engineer, decompile, disassemble, or otherwise attempt to
                        derive the source code, algorithms, or underlying architecture of
                        the Services or any component thereof.
                    </li>
                    <li>
                        Benchmark, test, or evaluate the Services for competitive purposes
                        or publish or disclose performance data without the Company&#39;s
                        prior written consent.
                    </li>
                    <li>
                        Resell, sublicense, redistribute, or make the Services available
                        to third parties without the Company&#39;s prior written consent.
                    </li>
                    <li>
                        Use the Services to develop a competing product or service, or to
                        train any AI/ML model using the Services&#39; outputs.
                    </li>
                    <li>
                        Exceed published API rate limits or usage quotas, or use automated
                        means to scrape, extract, or harvest data from the Services.
                    </li>
                    <li>
                        Use the Services in any manner that could subject the Company to
                        liability, regulatory action, or reputational harm.
                    </li>
                </ul>
                <p className={cls.text}>
                    <strong>Account Security.</strong> You are responsible for maintaining
                    the security and confidentiality of your account credentials and for
                    all activities that occur under your account, whether authorized by
                    you or not. You must immediately notify us of any unauthorized use of
                    your account or any other breach of security.
                </p>
                <p className={cls.text}>
                    <strong>Vicarious Liability.</strong> You are responsible for the
                    actions and omissions of your employees, contractors, agents, and any
                    other individuals who access the Services through your account. Any
                    violation of this Acceptable Use Policy by such individuals shall be
                    treated as a violation by you.
                </p>
                <p className={cls.text}>
                    <strong>Remedies.</strong> We reserve the right, in our sole discretion,
                    to immediately suspend or terminate your access, remove infringing
                    content, report violations to law enforcement, and pursue any other
                    remedies available at law or in equity, without prior notice and without
                    liability to you. Termination under this section does not relieve you
                    of any obligation to pay accrued fees or any indemnification obligations.
                </p>
            </section>

            {/* §7 — THIRD-PARTY SERVICES */}
            <section className={cls.section}>
                <h2 className={cls.sectionTitle}>7. Third-Party Services</h2>
                <p className={cls.text}>
                    The Services integrate with and depend upon third-party platforms,
                    including but not limited to Stripe for payment processing, cloud
                    infrastructure providers (e.g., AWS, GCP), AI/ML service providers
                    (e.g., OpenAI), SIP/PBX providers, and email service providers
                    (collectively, &quot;Third-Party Services&quot;). You acknowledge and
                    agree that:
                </p>
                <ul className={cls.list}>
                    <li>
                        The Company does <strong>not control</strong>, and is <strong>not
                            responsible for</strong>, the availability, uptime, security,
                        accuracy, reliability, performance, pricing, or policies of any
                        Third-Party Service.
                    </li>
                    <li>
                        Any interruption, degradation, modification, discontinuation, or
                        failure of a Third-Party Service is <strong>not a breach</strong> of
                        these Terms by the Company, and the Company shall have no liability
                        to you for any losses, damages, or claims arising therefrom.
                    </li>
                    <li>
                        Your use of Third-Party Services is governed exclusively by their
                        respective terms of service, privacy policies, and acceptable use
                        policies, and you are responsible for reviewing and complying with
                        such terms.
                    </li>
                    <li>
                        The Company makes <strong>no warranty, representation, or
                            guarantee</strong> regarding any Third-Party Service, and
                        <strong> expressly disclaims all liability</strong> (direct, indirect,
                        incidental, consequential, or otherwise) arising from or related
                        to Third-Party Services, to the maximum extent permitted by law.
                    </li>
                    <li>
                        You shall not aggregate or combine any claim against the Company
                        arising from a Third-Party Service failure with any other claim
                        under these Terms.
                    </li>
                </ul>
            </section>

            {/* §8 — DATA PROCESSING & PRIVACY */}
            <section className={cls.section}>
                <h2 className={cls.sectionTitle}>8. Data Processing, Privacy &amp; Security</h2>
                <p className={cls.text}>
                    Our collection and use of personal data is governed by our{' '}
                    <Link to="/legal/privacy-policy" className={cls.link}>Privacy Policy</Link>,
                    which is incorporated herein by reference. To the extent we process personal
                    data on your behalf as a data processor (as defined under GDPR) or service
                    provider (as defined under CCPA), our{' '}
                    <Link to="/legal/dpa" className={cls.link}>Data Processing Agreement</Link>{' '}
                    (&quot;DPA&quot;) governs such processing.
                </p>
                <p className={cls.text}>
                    <strong>Customer Backup Responsibility.</strong> You are solely
                    responsible for maintaining independent backups of your Customer Data,
                    including transcripts, conversation logs, and any AI-generated content.
                    The Company shall have <strong>no liability whatsoever</strong> for any
                    loss, corruption, destruction, or unavailability of Customer Data,
                    regardless of the cause (including system failures, security incidents,
                    Third-Party Service outages, or human error).
                </p>
                <p className={cls.text}>
                    <strong>Security.</strong> We implement commercially reasonable
                    administrative, technical, and physical security measures to protect
                    Customer Data. However, you acknowledge that no method of electronic
                    storage or transmission is 100% secure, and the Company <strong>does not
                        guarantee</strong> the absolute security or integrity of any data. You
                    accept the inherent risks of transmitting data over the internet.
                </p>
                <p className={cls.text}>
                    <strong>Data Breach Notification.</strong> In the event of a confirmed
                    security breach affecting your personal data, we will notify you without
                    undue delay and in no event later than seventy-two (72) hours after
                    becoming aware of the breach, as required by applicable law. Notification
                    will include the nature of the breach, categories of data affected,
                    approximate number of records affected, and measures taken or proposed
                    to address the breach. The Company&#39;s liability for any data breach
                    is subject to the limitations in Section 11.
                </p>
                <p className={cls.text}>
                    <strong>Data Retention After Termination.</strong> Upon termination of
                    your account, we will retain your data for thirty (30) days to allow
                    you to export it. After this period, we will delete or anonymize your
                    data within ninety (90) days, except as required by law or for legitimate
                    business purposes (e.g., billing records, dispute resolution). The
                    Company shall have no liability for data deleted in accordance with
                    this provision.
                </p>
            </section>

            {/* §9 — FEES & PAYMENTS */}
            <section className={cls.section}>
                <h2 className={cls.sectionTitle}>9. Fees and Payments</h2>
                <p className={cls.text}>
                    <strong>Subscription Fees.</strong> You agree to pay all fees specified
                    in your subscription plan. All fees are <strong>non-refundable</strong>{' '}
                    except as expressly stated herein or as required by applicable law.
                    Fees are exclusive of all taxes, levies, and duties.
                </p>
                <p className={cls.text}>
                    <strong>Auto-Renewal.</strong> Your subscription will automatically
                    renew at the end of each billing period at the then-current rate
                    unless you cancel prior to the renewal date. You authorize us to
                    charge your payment method for each renewal period.
                </p>
                <p className={cls.text}>
                    <strong>Payment Processing.</strong> Payments are processed via Stripe.
                    By providing payment information, you authorize us and Stripe to charge
                    your designated payment method in accordance with the applicable plan.
                    You are solely responsible for the accuracy and completeness of your
                    payment information.
                </p>
                <p className={cls.text}>
                    <strong>Late Payments.</strong> Overdue amounts shall accrue interest
                    at the lesser of 1.5% per month (18% per annum) or the maximum rate
                    permitted by applicable law, from the due date until paid in full.
                    You shall also be responsible for all costs of collection, including
                    reasonable attorneys&#39; fees.
                </p>
                <p className={cls.text}>
                    <strong>Suspension for Non-Payment.</strong> Without limiting any other
                    remedies, the Company reserves the right to suspend your access to the
                    Services immediately upon five (5) business days&#39; written notice
                    of non-payment. Suspension does not relieve you of your obligation to
                    pay all outstanding fees.
                </p>
                <p className={cls.text}>
                    <strong>Fee Disputes.</strong> Any dispute regarding fees must be
                    submitted in writing within thirty (30) days of the invoice date.
                    Failure to dispute fees within this period constitutes your acceptance
                    and waiver of any objection to the invoiced amounts.
                </p>
                <p className={cls.text}>
                    <strong>Price Changes.</strong> We reserve the right to change our fees
                    at any time. Price changes for existing subscriptions will take effect
                    at the next renewal period, with at least thirty (30) days&#39; advance
                    notice.
                </p>
                <p className={cls.text}>
                    <strong>Taxes.</strong> You are responsible for all applicable taxes,
                    duties, withholdings, and governmental assessments arising from your
                    use of the Services, excluding taxes based solely on the Company&#39;s
                    net income. If we are required to collect or pay taxes on your behalf,
                    such amounts will be invoiced to you and are immediately due and payable.
                </p>
            </section>

            {/* §10 — INTELLECTUAL PROPERTY */}
            <section className={cls.section}>
                <h2 className={cls.sectionTitle}>10. Intellectual Property</h2>
                <p className={cls.text}>
                    <strong>Company IP.</strong> The Company retains all rights, title, and
                    interest in and to the Services, including all software, source code,
                    object code, algorithms, AI/ML models and weights, training data,
                    APIs, documentation, user interfaces, designs, trademarks, trade
                    secrets, patents, and all other intellectual property rights
                    (collectively, &quot;Company IP&quot;). Nothing in these Terms grants
                    you any right, title, or interest in the Company IP except for the
                    limited, non-exclusive, non-transferable, non-sublicensable,
                    revocable right to access and use the Services during your active
                    subscription, solely in accordance with these Terms.
                </p>
                <p className={cls.text}>
                    <strong>License Restrictions.</strong> Without limiting Section 6, you
                    shall not: (a) copy, modify, adapt, translate, or create derivative
                    works of any portion of the Services; (b) reverse engineer, decompile,
                    disassemble, or otherwise attempt to discover the source code or
                    underlying algorithms of the Services; (c) remove, alter, or obscure
                    any proprietary notices, labels, or marks on the Services;
                    (d) sublicense, lease, rent, sell, or otherwise transfer your rights
                    to the Services to any third party; or (e) use the Services to build
                    a similar or competitive product or service.
                </p>
                <p className={cls.text}>
                    <strong>Customer Data.</strong> You retain all ownership rights in any
                    data, content, or configurations you upload to the Services
                    (&quot;Customer Data&quot;). You grant us a limited, non-exclusive,
                    royalty-free, worldwide license to use, process, store, and transmit
                    Customer Data solely as necessary to provide, maintain, and improve
                    the Services and to comply with applicable law. We will not use
                    Customer Data for any other purpose without your express consent.
                </p>
                <p className={cls.text}>
                    <strong>AI-Generated Content Ownership.</strong> You acknowledge that
                    AI-generated content (including voice responses, transcriptions, and
                    summaries) is produced by probabilistic models and that neither party
                    may have exclusive ownership rights in such outputs. To the extent
                    permitted by law, AI-generated content created using your Customer
                    Data is licensed to you for your internal business purposes, subject
                    to these Terms. The Company retains all rights in the underlying AI/ML
                    models, algorithms, and technology used to generate such content.
                </p>
                <p className={cls.text}>
                    <strong>Aggregated and Anonymized Data.</strong> Notwithstanding
                    anything to the contrary, the Company may collect, use, and disclose
                    aggregated, anonymized, or de-identified data derived from your use
                    of the Services for any lawful business purpose, including but not
                    limited to analytics, benchmarking, service improvement, and the
                    development of new products and features. Such data shall not identify
                    you or any individual and shall be the Company&#39;s sole property.
                </p>
                <p className={cls.text}>
                    <strong>Feedback.</strong> If you provide us with feedback, suggestions,
                    ideas, enhancement requests, or recommendations regarding the Services
                    (&quot;Feedback&quot;), you grant us an unrestricted, perpetual,
                    irrevocable, worldwide, royalty-free, fully paid-up, and
                    sublicensable license to use, reproduce, modify, distribute, and
                    commercialize such Feedback for any purpose without compensation,
                    attribution, or obligation to you.
                </p>
            </section>

            {/* §11 — LIMITATION OF LIABILITY */}
            <section className={cls.section}>
                <h2 className={cls.sectionTitle}>11. Limitation of Liability</h2>
                <p className={cls.textUppercase}>
                    TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, THE FOLLOWING
                    LIMITATIONS SHALL APPLY REGARDLESS OF WHETHER THE COMPANY HAS BEEN
                    ADVISED OF THE POSSIBILITY OF SUCH DAMAGES AND REGARDLESS OF WHETHER
                    ANY REMEDY FAILS OF ITS ESSENTIAL PURPOSE:
                </p>

                <p className={cls.text}>
                    <strong>11.1 Aggregate Cap on Company Liability.</strong> THE COMPANY&#39;S
                    TOTAL AGGREGATE LIABILITY ARISING OUT OF OR RELATED TO THESE TERMS,
                    THE SERVICES, OR ANY AI-GENERATED CONTENT, WHETHER IN CONTRACT, TORT
                    (INCLUDING NEGLIGENCE), STRICT LIABILITY, STATUTORY LIABILITY, OR ANY
                    OTHER LEGAL OR EQUITABLE THEORY, SHALL NOT EXCEED THE LESSER OF:
                    (A) THE TOTAL FEES ACTUALLY PAID BY YOU TO THE COMPANY DURING THE
                    THREE (3) MONTHS IMMEDIATELY PRECEDING THE FIRST EVENT GIVING RISE TO
                    THE LIABILITY; OR (B) ONE THOUSAND US DOLLARS (US $1,000). THIS
                    LIMITATION APPLIES INDIVIDUALLY AND IN THE AGGREGATE TO ALL CLAIMS
                    ARISING UNDER OR RELATED TO THESE TERMS.
                </p>

                <p className={cls.text}>
                    <strong>11.2 Exclusion of Indirect Damages.</strong> IN NO EVENT SHALL
                    THE COMPANY BE LIABLE FOR ANY: (A) INDIRECT, INCIDENTAL, SPECIAL,
                    CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES; (B) LOSS OF PROFITS,
                    REVENUE, BUSINESS, SAVINGS, GOODWILL, OR ANTICIPATED BENEFITS;
                    (C) LOSS OF OR DAMAGE TO DATA, INCLUDING BUT NOT LIMITED TO
                    TRANSCRIPTS, CONVERSATION LOGS, OR AI-GENERATED CONTENT; (D) BUSINESS
                    INTERRUPTION, DOWNTIME, OR LOSS OF USE; (E) COST OF PROCUREMENT OF
                    SUBSTITUTE GOODS OR SERVICES; (F) REPUTATIONAL HARM; OR (G) ANY
                    DAMAGES ARISING FROM OR RELATED TO ERRORS, INACCURACIES,
                    HALLUCINATIONS, OR OMISSIONS IN AI-GENERATED CONTENT — REGARDLESS
                    OF THE CAUSE OF ACTION OR THE THEORY OF LIABILITY, EVEN IF THE
                    COMPANY HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
                </p>

                <p className={cls.text}>
                    <strong>11.3 AI and Automated System Disclaimer.</strong> WITHOUT
                    LIMITING THE FOREGOING, THE COMPANY SHALL HAVE NO LIABILITY WHATSOEVER
                    FOR: (A) ERRORS, INACCURACIES, HALLUCINATIONS, OR CONTEXTUALLY
                    INAPPROPRIATE OUTPUTS GENERATED BY AI OR MACHINE LEARNING SYSTEMS;
                    (B) DECISIONS MADE OR ACTIONS TAKEN BY YOU OR ANY THIRD PARTY IN
                    RELIANCE ON AI-GENERATED CONTENT; (C) FAILURES OF SPEECH-TO-TEXT
                    TRANSCRIPTION ACCURACY; (D) INAPPROPRIATE, OFFENSIVE, OR LEGALLY
                    NON-COMPLIANT AI RESPONSES DELIVERED TO CALL PARTICIPANTS; OR
                    (E) ANY CONSEQUENCES ARISING FROM THE DEPLOYMENT OF AI-GENERATED
                    CONTENT IN REGULATED INDUSTRIES (INCLUDING HEALTHCARE, FINANCIAL
                    SERVICES, LEGAL, AND EMERGENCY SERVICES).
                </p>

                <p className={cls.text}>
                    <strong>11.4 Customer Sole Responsibility.</strong> You acknowledge
                    and agree that you bear sole and exclusive responsibility for:
                </p>
                <ul className={cls.list}>
                    <li>
                        All uses of the Services, including all voice interactions and AI
                        responses initiated through your account.
                    </li>
                    <li>
                        Ensuring compliance with all applicable laws, regulations, and
                        industry standards in your use of the Services, including TCPA,
                        GDPR, CCPA, HIPAA, PCI-DSS, and all applicable state and
                        international regulations.
                    </li>
                    <li>
                        Reviewing, validating, and approving all AI-generated content
                        before deployment to end users or reliance thereon.
                    </li>
                    <li>
                        Obtaining all necessary consents, authorizations, and permissions
                        from call participants, data subjects, and end users.
                    </li>
                    <li>
                        Any and all claims, disputes, complaints, or regulatory actions
                        brought by your end users, call participants, or regulatory
                        authorities.
                    </li>
                </ul>

                <p className={cls.text}>
                    <strong>11.5 Carve-Outs.</strong> The liability cap in Section 11.1
                    shall not apply to: (a) your payment obligations under these Terms;
                    (b) your indemnification obligations under Section 12; (c) your breach
                    of Section 6 (Acceptable Use Policy) or Section 5 (Telecommunications
                    Compliance); or (d) liability arising from a party&#39;s fraud or
                    intentional criminal misconduct. For the avoidance of doubt, the
                    exclusion of indirect damages in Section 11.2 applies to all claims,
                    including those carved out from the liability cap.
                </p>

                <p className={cls.text}>
                    <strong>11.6 Allocation of Risk.</strong> You acknowledge that the fees
                    charged for the Services reflect the allocation of risk set forth in
                    this Section 11 and that the Company would not enter into these Terms
                    without these limitations. These limitations shall apply notwithstanding
                    the failure of the essential purpose of any limited remedy and to the
                    fullest extent permitted by applicable law.
                </p>

                <p className={cls.text}>
                    <strong>11.7 No Liability for Third-Party Services.</strong> Without
                    limiting Section 7, the Company shall have no liability whatsoever for
                    any losses, damages, or claims arising from or related to the
                    performance, non-performance, interruption, modification, or
                    discontinuation of any Third-Party Service, including but not limited
                    to AI/ML providers, cloud infrastructure, SIP/PBX carriers, payment
                    processors, and email service providers.
                </p>
            </section>

            {/* §12 — INDEMNIFICATION */}
            <section className={cls.section}>
                <h2 className={cls.sectionTitle}>12. Indemnification</h2>

                <p className={cls.text}>
                    <strong>12.1 Customer Indemnification.</strong> You agree to defend,
                    indemnify, and hold harmless the Company, its affiliates, parent
                    companies, subsidiaries, officers, directors, employees, contractors,
                    agents, licensors, and service providers (collectively, the
                    &quot;Company Indemnitees&quot;) from and against any and all
                    third-party claims, demands, suits, actions, proceedings, losses,
                    liabilities, damages, judgments, penalties, fines, costs, and expenses
                    (including reasonable attorneys&#39; fees, expert witness fees, and
                    costs of litigation or arbitration) (collectively, &quot;Losses&quot;)
                    arising out of or related to:
                </p>
                <ul className={cls.list}>
                    <li>
                        Your use of the Services, including any voice interactions and AI
                        responses initiated through your account.
                    </li>
                    <li>
                        Your violation of these Terms, including but not limited to breach
                        of the Acceptable Use Policy (§6) and representations and warranties.
                    </li>
                    <li>
                        Your violation of any applicable law, rule, or regulation, including
                        TCPA, TSR, state telemarketing and consent laws,
                        GDPR, CCPA, HIPAA, and any other privacy, consumer protection,
                        or telecommunications regulation.
                    </li>
                    <li>
                        Your Customer Data, including any content, data, or information you
                        upload, transmit, or process through the Services.
                    </li>
                    <li>
                        Any AI-generated responses or content that you deploy, distribute,
                        or make available to call participants, end users, or third parties,
                        including claims alleging that such content is inaccurate, misleading,
                        defamatory, or in violation of any law.
                    </li>
                    <li>
                        Any dispute, claim, complaint, or regulatory action between you and
                        your end users, call participants, customers, or any third party.
                    </li>
                    <li>
                        Your failure to obtain necessary consents, authorizations, or
                        permissions from call participants or data subjects.
                    </li>
                    <li>
                        Any claims arising from your use of the Services in regulated
                        industries (healthcare, financial services, legal, emergency services)
                        where AI-generated content may be subject to heightened legal standards.
                    </li>
                </ul>

                <p className={cls.text}>
                    <strong>12.2 Company IP Indemnification.</strong> Subject to the
                    limitations in this Section 12, the Company will defend and indemnify
                    you against third-party claims that the Company&#39;s proprietary
                    software (excluding Third-Party Services, AI/ML models, open-source
                    components, and Customer Data), as provided by the Company and used
                    strictly in accordance with these Terms, directly infringes a valid,
                    issued United States patent, registered copyright, or misappropriates
                    a trade secret. This obligation does <strong>not</strong> apply to
                    claims arising from:
                </p>
                <ul className={cls.list}>
                    <li>Your modification, customization, or configuration of the Services.</li>
                    <li>
                        Your combination of the Services with any third-party products,
                        services, data, content, or technology not provided by the Company.
                    </li>
                    <li>Your use of the Services in violation of these Terms.</li>
                    <li>
                        Use of a non-current version of the Services where infringement
                        would have been avoided by using a current version.
                    </li>
                    <li>
                        AI-generated outputs, transcriptions, or any content generated by
                        AI/ML models or Third-Party Services.
                    </li>
                    <li>
                        Open-source software components included in or used by the Services.
                    </li>
                </ul>
                <p className={cls.text}>
                    The Company&#39;s maximum aggregate liability under this Section 12.2
                    shall not exceed the fees paid by you during the twelve (12) months
                    preceding the claim.
                </p>

                <p className={cls.text}>
                    <strong>12.3 Indemnification Procedure.</strong> The indemnified party
                    must: (i) provide prompt written notice to the indemnifying party (failure
                    to provide prompt notice shall relieve the indemnifying party of its
                    obligations to the extent materially prejudiced); (ii) grant the
                    indemnifying party sole control of the defense and settlement (the
                    indemnifying party shall not settle any claim that imposes liability
                    on the indemnified party without the indemnified party&#39;s prior
                    written consent, not to be unreasonably withheld); and (iii) provide
                    reasonable cooperation at the indemnifying party&#39;s expense.
                </p>

                <p className={cls.text}>
                    <strong>12.4 Sole Remedy.</strong> This Section 12 states each party&#39;s
                    sole and exclusive remedy, and the other party&#39;s sole and exclusive
                    liability, for any third-party intellectual property infringement claims.
                </p>
            </section>

            {/* §13 — DISPUTE RESOLUTION */}
            <section className={cls.section}>
                <h2 className={cls.sectionTitle}>
                    13. Dispute Resolution; Arbitration; Class Action Waiver
                </h2>
                <p className={cls.text}>
                    <strong>13.1 Informal Resolution.</strong> Before initiating any formal
                    dispute resolution, you agree to contact us at{' '}
                    <a href="mailto:legal@aipbx.net" className={cls.link}>legal@aipbx.net</a>{' '}
                    with a written description of the dispute. Both parties will attempt to
                    resolve the issue informally within thirty (30) days. <strong>You agree
                        that the informal resolution process is a prerequisite to initiating
                        any arbitration or court proceeding</strong>, and failure to comply
                    with this requirement shall be grounds for dismissal.
                </p>
                <p className={cls.text}>
                    <strong>13.2 Binding Arbitration.</strong> Any dispute, claim, or
                    controversy arising out of or relating to these Terms or the Services
                    that is not resolved informally shall be resolved by binding individual
                    arbitration administered by the American Arbitration Association
                    (&quot;AAA&quot;) under its Commercial Arbitration Rules (or Consumer
                    Arbitration Rules if you qualify as a consumer). The arbitration shall
                    be conducted in Chicago, Illinois, unless otherwise agreed. The
                    arbitrator&#39;s decision shall be final and binding and may be entered
                    as a judgment in any court of competent jurisdiction. The arbitrator
                    shall have no authority to award damages in excess of the limitations
                    set forth in Section 11.
                </p>
                <p className={cls.text}>
                    <strong>13.3 Arbitration Fees.</strong> If you are an individual (not a
                    business entity), the Company will pay all AAA filing and arbitrator fees
                    exceeding any amount you would have paid to file a claim in court. For
                    business entity customers, fees shall be allocated in accordance with
                    AAA rules. <strong>Prevailing Party Fees:</strong> In any arbitration or
                    legal proceeding between the Company and a business entity customer,
                    the prevailing party shall be entitled to recover its reasonable
                    attorneys&#39; fees, expert witness fees, and costs from the
                    non-prevailing party.
                </p>
                <p className={cls.text}>
                    <strong>13.4 Class Action Waiver.</strong> YOU AND THE COMPANY AGREE THAT
                    EACH MAY BRING CLAIMS AGAINST THE OTHER ONLY IN AN INDIVIDUAL CAPACITY
                    AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS, CONSOLIDATED,
                    MULTI-PLAINTIFF, OR REPRESENTATIVE PROCEEDING (INCLUDING BUT NOT LIMITED
                    TO CLAIMS UNDER THE PRIVATE ATTORNEYS GENERAL ACT OR SIMILAR STATUTES).
                    THE ARBITRATOR MAY NOT CONSOLIDATE MORE THAN ONE PERSON&#39;S CLAIMS AND
                    MAY NOT PRESIDE OVER ANY FORM OF CLASS, COLLECTIVE, OR REPRESENTATIVE
                    PROCEEDING. IF THIS CLASS ACTION WAIVER IS FOUND TO BE UNENFORCEABLE,
                    THEN THE ENTIRETY OF THIS ARBITRATION PROVISION SHALL BE NULL AND VOID,
                    AND DISPUTES SHALL BE RESOLVED IN THE COURTS SPECIFIED IN SECTION 17.
                </p>
                <p className={cls.text}>
                    <strong>13.5 Statute of Limitations.</strong> ANY CLAIM OR CAUSE OF
                    ACTION ARISING OUT OF OR RELATED TO THESE TERMS OR THE SERVICES MUST BE
                    FILED WITHIN ONE (1) YEAR AFTER SUCH CLAIM OR CAUSE OF ACTION AROSE.
                    FAILURE TO FILE WITHIN THIS PERIOD SHALL CONSTITUTE A PERMANENT AND
                    IRREVOCABLE WAIVER OF SUCH CLAIM.
                </p>
                <p className={cls.text}>
                    <strong>13.6 Opt-Out Right.</strong> You may opt out of this arbitration
                    agreement by sending written notice to{' '}
                    <a href="mailto:legal@aipbx.net" className={cls.link}>legal@aipbx.net</a>{' '}
                    within thirty (30) days of first accepting these Terms. Your notice must
                    include your name, account email, and a clear statement that you wish to
                    opt out of arbitration. If you opt out, disputes will be resolved in the
                    courts specified in Section 17.
                </p>
                <p className={cls.text}>
                    <strong>13.7 Small Claims Exception.</strong> Either party may bring an
                    individual action in small claims court for disputes within that
                    court&#39;s jurisdictional limits.
                </p>
                <p className={cls.text}>
                    <strong>13.8 Equitable Relief.</strong> Nothing in this section prevents
                    either party from seeking injunctive or other equitable relief in court
                    to protect intellectual property rights, enforce confidentiality
                    obligations, or prevent irreparable harm pending arbitration. You
                    acknowledge that any breach of Sections 6 (Acceptable Use Policy) or
                    10 (Intellectual Property) would cause irreparable harm to the Company
                    for which monetary damages would be inadequate, and the Company shall
                    be entitled to injunctive relief without the need to post a bond.
                </p>
                <p className={cls.text}>
                    <strong>13.9 FAA.</strong> These Terms evidence a transaction involving
                    interstate commerce. The Federal Arbitration Act (9 U.S.C. §§ 1–16)
                    governs the interpretation and enforcement of this arbitration provision.
                </p>
            </section>

            {/* §14 — TERMINATION */}
            <section className={cls.section}>
                <h2 className={cls.sectionTitle}>14. Termination</h2>
                <p className={cls.text}>
                    <strong>By Customer.</strong> You may terminate your account at any time
                    via the platform or by contacting us at{' '}
                    <a href="mailto:support@aipbx.net" className={cls.link}>support@aipbx.net</a>.
                    Termination by you does not entitle you to a refund of any fees already
                    paid, and you remain liable for all fees due through the end of the
                    then-current billing period.
                </p>
                <p className={cls.text}>
                    <strong>By Us — With Cure Period.</strong> For curable breaches (other
                    than those listed below), the Company will provide written notice and
                    a fifteen (15) day cure period. If the breach is not cured within this
                    period, the Company may terminate your access immediately.
                </p>
                <p className={cls.text}>
                    <strong>By Us — Immediate Termination.</strong> The Company may suspend
                    or terminate your access <strong>immediately without notice or cure
                        period</strong> if you: (a) breach Section 6 (Acceptable Use Policy);
                    (b) violate any applicable law or regulation; (c) fail to pay fees
                    within ten (10) days after written notice of non-payment; (d) engage
                    in conduct that could subject the Company to legal liability,
                    regulatory action, or reputational harm; (e) become subject to
                    bankruptcy, insolvency, receivership, or similar proceedings; or
                    (f) breach Section 10 (Intellectual Property).
                </p>
                <p className={cls.text}>
                    <strong>No Refunds for Cause.</strong> If the Company terminates your
                    account for cause (due to your breach), you shall not be entitled to
                    any refund of fees paid, and all outstanding fees shall become
                    immediately due and payable.
                </p>
                <p className={cls.text}>
                    <strong>Effect of Termination.</strong> Upon termination: (i) your right
                    to use the Services ceases immediately; (ii) you must immediately cease
                    all use of the Services and destroy all copies of any materials
                    received from the Company; (iii) you remain liable for all fees accrued
                    prior to termination; (iv) we will retain your data for thirty (30)
                    days as described in Section 8 above, after which it will be permanently
                    deleted without liability to the Company. The following Sections shall
                    survive termination or expiration of these Terms: 2 (Warranties), 3 (AI
                    Disclaimer), 4 (No Professional Advice), 5 (Telecommunications
                    Compliance), 6 (Acceptable Use Policy), 7 (Third-Party Services),
                    8 (Data/Privacy), 9 (Fees, to the extent of unpaid amounts), 10 (IP),
                    11 (Limitation of Liability), 12 (Indemnification), 13 (Arbitration),
                    17 (Governing Law), and 18 (General Provisions).
                </p>
            </section>

            {/* §15 — MODIFICATION OF TERMS */}
            <section className={cls.section}>
                <h2 className={cls.sectionTitle}>15. Modification of Terms</h2>
                <p className={cls.text}>
                    We may modify these Terms from time to time. For <strong>material
                        changes</strong> (including changes to fees, arbitration, limitation
                    of liability, or data processing), we will provide at least thirty
                    (30) days&#39; advance written notice via email to the address
                    associated with your account. Non-material changes (e.g., typographical
                    corrections, formatting) may take effect immediately upon posting.
                </p>
                <p className={cls.text}>
                    If you do not agree to a material change, you may terminate your account
                    without penalty before the change takes effect. Your continued use of the
                    Services after the effective date of any change constitutes acceptance
                    of the modified Terms. We will maintain an archive of prior versions
                    accessible upon request.
                </p>
            </section>

            {/* §16 — FORCE MAJEURE */}
            <section className={cls.section}>
                <h2 className={cls.sectionTitle}>16. Force Majeure</h2>
                <p className={cls.text}>
                    Neither party shall be liable for delays or failures in performance
                    resulting from causes beyond its reasonable control, including but not
                    limited to: acts of God; war; terrorism; civil unrest or riots;
                    sanctions or embargoes; governmental or regulatory actions (including
                    new laws, regulations, or government orders); epidemics or pandemics;
                    fire; floods; earthquakes; natural disasters; accidents; strikes or
                    labor disputes; shortages of transportation, facilities, fuel, energy,
                    labor, or materials; cyberattacks (including DDoS, ransomware, or
                    similar attacks); failures, outages, or degradation of internet,
                    telecommunications, cloud infrastructure, or Third-Party Services;
                    unavailability or changes in AI/ML model providers; supply chain
                    disruptions; or any other event beyond the reasonable control of the
                    affected party (each, a &quot;Force Majeure Event&quot;).
                </p>
                <p className={cls.text}>
                    The affected party must: (a) provide prompt written notice describing
                    the Force Majeure Event and its expected duration; (b) use commercially
                    reasonable efforts to mitigate its impact; and (c) resume performance
                    as soon as reasonably practicable. If a Force Majeure Event continues
                    for more than sixty (60) days, either party may terminate the affected
                    Services without liability. <strong>For the avoidance of doubt,
                        Customer&#39;s payment obligations are not excused by Force Majeure
                        Events.</strong>
                </p>
            </section>

            {/* §17 — GOVERNING LAW & VENUE */}
            <section className={cls.section}>
                <h2 className={cls.sectionTitle}>17. Governing Law and Venue</h2>
                <p className={cls.text}>
                    These Terms shall be governed by and construed in accordance with the
                    laws of the State of Illinois, without regard to its conflict of laws
                    principles. Subject to the arbitration provisions in Section 13, the
                    exclusive venue for any legal action shall be the state or federal courts
                    located in Cook County, Illinois, and each party irrevocably consents
                    to personal jurisdiction therein.
                </p>
            </section>

            {/* §18 — GENERAL PROVISIONS */}
            <section className={cls.section}>
                <h2 className={cls.sectionTitle}>18. General Provisions</h2>
                <p className={cls.text}>
                    <strong>Entire Agreement.</strong> These Terms, together with the
                    Privacy Policy, DPA, and any executed Order Forms, constitute the
                    entire agreement between you and us and supersede all prior
                    agreements, proposals, representations, understandings, and
                    negotiations, whether written or oral, relating to the subject
                    matter hereof. In the event of a conflict between these Terms and
                    any Order Form, the Order Form shall control with respect to the
                    applicable subscription only.
                </p>
                <p className={cls.text}>
                    <strong>Waiver.</strong> The failure of either party to enforce any
                    provision of these Terms shall not constitute a waiver of that party&#39;s
                    right to enforce that or any other provision in the future. Any waiver
                    must be in writing and signed by the waiving party to be effective.
                </p>
                <p className={cls.text}>
                    <strong>Severability.</strong> If any provision of these Terms is found
                    to be invalid, illegal, or unenforceable by a court of competent
                    jurisdiction, that provision shall be modified to the minimum extent
                    necessary to make it valid and enforceable while preserving the
                    original intent, and all remaining provisions shall remain in full
                    force and effect.
                </p>
                <p className={cls.text}>
                    <strong>Assignment.</strong> You may not assign, delegate, or transfer
                    these Terms or any rights or obligations hereunder, whether by
                    operation of law or otherwise, without our prior written consent.
                    Any attempted assignment without consent shall be null and void. We
                    may freely assign these Terms in connection with a merger, acquisition,
                    reorganization, or sale of all or substantially all of our assets
                    without notice or consent.
                </p>
                <p className={cls.text}>
                    <strong>Independent Contractors.</strong> The parties are independent
                    contractors. Nothing in these Terms creates or is intended to create
                    a partnership, joint venture, agency, franchise, or employment
                    relationship between the parties.
                </p>
                <p className={cls.text}>
                    <strong>No Third-Party Beneficiaries.</strong> These Terms are for the
                    benefit of the parties only. There are no third-party beneficiaries
                    to these Terms, and no third party shall have any right to enforce
                    any provision hereof.
                </p>
                <p className={cls.text}>
                    <strong>Export Compliance.</strong> You represent and warrant that you
                    are not located in, or a resident of, any country subject to U.S.
                    government embargo or that has been designated as a
                    &quot;terrorist-supporting&quot; country, and that you are not listed
                    on any U.S. government list of prohibited or restricted parties. You
                    shall comply with all applicable export control laws and regulations.
                </p>
                <p className={cls.text}>
                    <strong>Cumulative Remedies.</strong> All rights and remedies provided
                    in these Terms are cumulative and not exclusive of any other rights or
                    remedies available at law or in equity.
                </p>
                <p className={cls.text}>
                    <strong>Notices.</strong> All legal notices must be sent to{' '}
                    <a href="mailto:legal@aipbx.net" className={cls.link}>legal@aipbx.net</a>.
                    Notices to you will be sent to the email address associated with your
                    account. Notices are deemed received upon confirmed delivery or, if
                    sent by email, upon transmission (excluding bounce-backs).
                </p>
                <p className={cls.text}>
                    <strong>Electronic Communications.</strong> You consent to receive
                    communications from us electronically, and you agree that all agreements,
                    notices, disclosures, and other communications we provide electronically
                    satisfy any legal requirement that such communications be in writing.
                </p>
                <p className={cls.text}>
                    <strong>Headings.</strong> Section headings are for convenience only
                    and shall not affect the interpretation of these Terms.
                </p>
            </section>

            {/* §19 — CONTACT */}
            <section className={cls.section}>
                <h2 className={cls.sectionTitle}>19. Contact Information</h2>
                <p className={cls.text}>
                    For questions regarding these Terms, please contact us at:
                </p>
                <address className={cls.address}>
                    Lets Fix LLC<br />
                    Chicago, Illinois<br />
                    Email:{' '}
                    <a href="mailto:legal@aipbx.net" className={cls.link}>
                        legal@aipbx.net
                    </a><br />
                    General inquiries:{' '}
                    <a href="mailto:info@aipbx.net" className={cls.link}>
                        info@aipbx.net
                    </a>
                </address>
            </section>
        </article>
    </Page>
))

export default TermsOfServicePage
