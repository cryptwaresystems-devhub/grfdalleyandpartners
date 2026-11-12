export const enquiryTypes = ['General enquiry', 'Consultation request', 'Professional enquiry'] as const;
export interface ContactRequest { name: string; email: string; phone: string; nature: string; message: string; website: string; kind: 'enquiry' | 'consultation'; preference: string; token: string; requestId: string }
export function validateContact(value: Partial<ContactRequest>) {
  const errors: Record<string, string> = {};
  if (!value.name?.trim() || value.name.length > 100) errors.name = 'Enter your name (up to 100 characters).';
  if (!value.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email) || value.email.length > 150) errors.email = 'Enter a valid email address.';
  if (value.phone && (!/^[+()\d .-]{5,40}$/.test(value.phone))) errors.phone = 'Enter a valid phone number, or leave this optional field blank.';
  if (!enquiryTypes.includes(value.nature as typeof enquiryTypes[number])) errors.nature = 'Choose the nature of your enquiry.';
  if ((value.message?.length ?? 0) > 1500) errors.message = 'Use no more than 1,500 characters.';
  if ((value.preference?.length ?? 0) > 200) errors.preference = 'Use no more than 200 characters.';
  if (value.kind !== 'enquiry' && value.kind !== 'consultation') errors.kind = 'Choose a supported request type.';
  return errors;
}
