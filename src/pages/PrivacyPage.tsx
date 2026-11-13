import { Link } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { Container } from '../components/Container';
import { privacyPolicy, type PrivacyPolicy } from '../data/privacy';
import { isPrivacyPolicyApproved } from '../lib/privacy';
export function PrivacyPage({ policy = privacyPolicy }: { policy?: PrivacyPolicy }) {
  const approved = isPrivacyPolicyApproved(policy);
  return <><PageHeader title="Privacy Policy" eyebrow="Privacy" description={approved ? "The firm-approved Privacy Policy." : 'The firm-approved legal text is awaiting publication.'} breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Privacy Policy' }]} /><Container><article className="privacy-content reading-width section-space">{approved ? <><p>Effective date: <time dateTime={policy.effectiveDate!}>{policy.effectiveDate}</time></p>{policy.sections.map((section, index) => <section key={index}><h2>{section.heading}</h2>{section.paragraphs.map((paragraph, paragraphIndex) => <p key={paragraphIndex}>{paragraph}</p>)}</section>)}</> : <div className="privacy-pending"><p className="eyebrow">Legal text pending</p><h2>Awaiting the firm's approved policy.</h2><p>The Privacy Policy has not yet been supplied and approved for publication. This notice is a project-status message, not a Privacy Policy.</p><p>This website remains a design preview. Production launch is blocked until the approved legal text is in place.</p><Link className="button button--outline" to="/contact">Contact the firm</Link></div>}</article></Container></>;
}
