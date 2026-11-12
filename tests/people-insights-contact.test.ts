import { PresentationProvider } from '../src/lib/presentation';
import { afterEach, test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { Window } from 'happy-dom';
import { PeoplePage } from '../src/pages/PeoplePage';
import { InsightsPage } from '../src/pages/InsightsPage';
import { ContactPage } from '../src/pages/ContactPage';
import { LawyerProfileTemplate } from '../src/components/people/LawyerProfileTemplate';
import { InsightDetailTemplate } from '../src/components/insights/InsightDetailTemplate';
import { ConsultationBooking } from '../src/components/contact/ConsultationBooking';
import { lawyers } from '../src/data/lawyers';
import { insights } from '../src/data/insights';
import { practices } from '../src/data/practices';
import { getVisibleLawyers, searchLawyers } from '../src/lib/people';
import { getVisibleInsights, insightDateLabel } from '../src/lib/insights';
import { enquiryMailto, configuredBookingUrl } from '../src/lib/contact';

const windows: Window[] = [];
afterEach(() => { windows.splice(0).forEach(dom => dom.happyDOM.close()); });
function render(element: Parameters<typeof renderToStaticMarkup>[0], width = 1440) {
  const dom = new Window({ width, height: 900 }); windows.push(dom);
  dom.document.body.innerHTML = renderToStaticMarkup(h(MemoryRouter, null, h(PresentationProvider, { mode: 'management-preview' }, element)));
  return dom;
}
test('all eight people use biography-checked portraits, valid practice IDs and pending approval', () => {
  assert.equal(lawyers.length, 8);
  assert.equal(getVisibleLawyers().length, 0);
  assert.equal(getVisibleLawyers('management-preview').length, 8);
  for (const person of lawyers) {
    assert.equal(person.editorial.status, 'in-review');
    assert.equal(person.verification?.photoMatch, 'embedded-portrait-match');
    assert.ok(person.verification?.biographyFileId && person.verification.portraitFileId);
    assert.ok(person.portrait && existsSync(`public${person.portrait}`));
    for (const id of person.practiceIds) assert.ok(practices.some(item => item.id === id));
    assert.equal(person.email, null);
  }
  const doc = render(h(PeoplePage)).document;
  assert.equal(doc.querySelectorAll('.directory-person').length, 8);
  for (const person of lawyers) assert.ok(doc.querySelector(`a[href="/people/${person.slug}"]`));
});
test('source verification does not promote drafts or incomplete approvals', () => {
  const person = lawyers[0];
  for (const status of ['draft', 'archived', 'approved'] as const) {
    assert.equal(getVisibleLawyers('management-preview', [{ ...person, editorial: { ...person.editorial, status } }]).length, 0);
  }
  assert.equal(getVisibleLawyers('management-preview', [{ ...person, verification: undefined }]).length, 0);
  assert.equal(getVisibleInsights().length, 0);
  const item = insights[0];
  assert.equal(getVisibleInsights('management-preview', [{ ...item, verification: undefined }]).length, 0);
  assert.equal(getVisibleInsights('management-preview', [{ ...item, editorial: { ...item.editorial, status: 'draft' } }]).length, 0);
});
test('people search matches names, roles, practices and blank queries consistently', () => {
  assert.equal(searchLawyers(lawyers, '  ').length, 8);
  assert.equal(searchLawyers(lawyers, 'FATAI DALLEY')[0].id, lawyers[1].id);
  assert.equal(searchLawyers(lawyers, 'faith family')[0].id, 'faith-izegboya-adebo');
  assert.equal(searchLawyers(lawyers, 'Associate Abuja')[0].id, 'obinna-e-omeh');
  assert.equal(searchLawyers(lawyers, 'not a real person').length, 0);
});
test('profile templates omit unsupplied facts and keep historical bibliography qualified', () => {
  const obinna = render(h(LawyerProfileTemplate, { person: lawyers.find(item => item.id === 'obinna-e-omeh')! })).document;
  assert.ok(!obinna.body.textContent.includes('Year of call'));
  assert.ok(!obinna.body.textContent.includes('LL.B.'));
  assert.ok(!obinna.querySelector('.profile-linkedin'));
  const aderemi = render(h(LawyerProfileTemplate, { person: lawyers[0] })).document;
  assert.ok(aderemi.body.textContent.includes('Professional memberships'));
  assert.ok(aderemi.body.textContent.includes('Selected bibliography'));
  assert.ok(aderemi.body.textContent.includes('await final review'));
  const ajibola = render(h(LawyerProfileTemplate, { person: lawyers[1] })).document;
  assert.equal(ajibola.querySelectorAll('a[href^="/insights/"]').length, 2);
});
test('Insights only shows verified historic entries and suppresses unapproved article bodies', () => {
  const entries = getVisibleInsights('management-preview');
  assert.equal(entries.length, 2);
  assert.equal(insightDateLabel(entries[0]), 'December 2019');
  assert.equal(insightDateLabel(entries[1]), '3 September 2019');
  const doc = render(h(InsightsPage)).document;
  assert.equal(doc.querySelectorAll('.insight-list-card').length, 2);
  assert.equal(doc.querySelectorAll('.insight-category-filters button').length, 7);
  const detail = render(h(InsightDetailTemplate, { insight: { ...entries[0], body: 'UNAPPROVED BODY MUST STAY HIDDEN' } })).document;
  assert.ok(!detail.body.textContent.includes('UNAPPROVED BODY MUST STAY HIDDEN'));
  assert.ok(detail.querySelector(`a[href="${entries[0].externalUrl}"]`));
  assert.ok(detail.querySelector(`a[href="/people/${lawyers[1].slug}"]`));
});
test('Contact has actual offices, accessible form fields and honest pending services', () => {
  const doc = render(h(ContactPage)).document;
  assert.ok(doc.body.textContent.includes('26 Igbosere Road'));
  assert.ok(doc.body.textContent.includes('13 Finima Street'));
  assert.ok(doc.body.textContent.includes('Address pending confirmation'));
  assert.ok(doc.body.textContent.includes('does not send a message'));
  assert.ok(doc.body.textContent.includes('Online booking forthcoming'));
  assert.ok(!doc.querySelector('iframe'));
  for (const field of doc.querySelectorAll('input, select, textarea')) assert.ok(doc.querySelector(`label[for="${field.id}"]`));
  assert.ok(doc.querySelector('a[href="mailto:inq@grfdalleyandpartners.com"]'));
});
test('email drafts encode user data and booking requires a valid configured URL', () => {
  const url = enquiryMailto({ name: 'A & B', email: 'person@example.com', phone: '+234 123', nature: 'General enquiry', message: 'Terms & details?\nPlease reply.' });
  assert.ok(url.startsWith('mailto:inq@grfdalleyandpartners.com?'));
  const parameters = new URLSearchParams(url.split('?')[1]);
  assert.equal(parameters.get('subject'), 'Website enquiry: General enquiry');
  assert.ok(parameters.get('body')?.includes('Name: A & B'));
  assert.ok(parameters.get('body')?.includes('Terms & details?'));
  for (const invalid of [null, '', 'javascript:alert(1)', 'https://example.com/booking', 'https://calendly.com/', 'https://calendly.com.evil.test/schedule']) assert.equal(configuredBookingUrl(invalid), null);
  const configured = 'https://calendly.com/test-fixture/consultation';
  assert.equal(configuredBookingUrl(configured), configured);
  assert.ok(render(h(ConsultationBooking, { bookingUrl: configured })).document.querySelector(`a[href="${configured}"]`));
});
test('People, Insights and Contact CSS adapts across MVP screen sizes', () => {
  for (const width of [320, 390, 768, 1024, 1440]) {
    const dom = render(h('div', null, h(PeoplePage), h(InsightsPage), h(ContactPage)), width);
    const style = dom.document.createElement('style'); style.textContent = readFileSync('src/styles/people-insights-contact.css', 'utf8'); dom.document.head.append(style);
    const columns = (selector: string) => dom.getComputedStyle(dom.document.querySelector(selector)!).gridTemplateColumns;
    assert.equal(columns('.people-directory-grid'), width < 480 ? '1fr' : width < 768 ? 'repeat(2, minmax(0, 1fr))' : width < 1024 ? 'repeat(3, minmax(0, 1fr))' : 'repeat(4, minmax(0, 1fr))');
    assert.equal(columns('.insights-list-grid'), width < 768 ? '1fr' : 'repeat(2, minmax(0, 1fr))');
    assert.equal(columns('.enquiry-fields'), width < 768 ? '1fr' : 'repeat(2, minmax(0, 1fr))');
    assert.equal(columns('.contact-offices-grid'), width < 768 ? '1fr' : 'repeat(3, minmax(0, 1fr))');
  }
});
