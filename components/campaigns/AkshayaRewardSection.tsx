import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QrCode, UserPlus, Coins, Gift, ArrowRight, ShieldCheck, Info } from 'lucide-react';
import Image from 'next/image';
import { Container } from '@/components/ui';
import Modal from '@/components/ui/Modal';
import { trackCustomEvent } from '@/lib/unified-analytics';

interface AkshayaRewardSectionProps {
  className?: string;
}

const TNC_TEXT = `AKSHAYA TRITIYA 2026 — FREE LAB-GROWN DIAMOND OFFER
TERMS & CONDITIONS
Offer Validity: April 17, 2026 to April 19, 2026 (this may vary store to store)
By participating in the Solitario Akshaya Tritiya 2026 Free Diamond Offer described below, you ("Customer", "Participant", "You") acknowledge that you have read, understood, and agree to be bound by these Terms & Conditions. These Terms & Conditions are legally binding.

1. Offer Description & Eligibility
Solitario is offering a complimentary lab grown lab-grown diamond("Free Diamond") to eligible walk-in customers at participating Solitario stores during the Akshaya Tritiya 2026 offer period, subject to the following conditions:
•	The offer is valid only for the first 101 customers per store across the entire offer period. Once 101 lab-grown diamonds at a store have been claimed, the offer at that store is permanently concluded.
•	The customer must present a valid Credit Card issued in their own name at the time of claiming the Free Diamond. This is mandatory. Customers without a credit card in their own name will not be eligible.
•	Debit cards, prepaid cards, virtual cards, or credit cards in another person's name will not be accepted.
•	The customer must also present a valid physical Government-issued Photo ID (Aadhaar Card, PAN Card, or Passport). The name on the ID must match the name on the credit card.
•	The offer is open to Indian residents aged 18 years and above only.
•	Only one (1) Free Diamond is permitted per person, per credit card, per family, and per household. If multiple members of the same household visit the same or different stores, only one Free Diamond will be issued to the household.
•	The participant must be physically present at the store to claim the Free Diamond. The offer cannot be claimed on behalf of another person, by proxy, or through any representative.
•	Solitario staff, employees, their immediate family members, and any persons directly or indirectly associated with the organisation or campaign are not eligible to participate.

2. Offer Period & Participating Stores
The offer is valid till stocks last or until the end of the offer period, whichever is earlier.
Offer Start Date: April 17, 2026
Offer End Date: April 19, 2026 (store closing time)
•	The offer is valid only during regular store operating hours on the dates mentioned below.
•	Diamonds will not be issued before the start of the offer period or after the offer period has ended, under any circumstances.
High Street Stores — April 17, 18 & 19, 2026
•	Koregaon Park, Pune
•	Baner, Pune
•	Linking Road, Santacruz (West), Mumbai
•	Vashi, Navi Mumbai
•	Karol Bagh (Pusa Road), Delhi
•	Paschim Vihar, Delhi
•	Dwarka (Krishna Plaza, Sector 12), Delhi
•	DLF Plaza, Delhi
•	Camac Street, Elgin, Kolkata
•	Banjara Hills (MPM Timesquare), Hyderabad
•	M.G. Road, Indore
Mall Stores — April 18 & 19, 2026
•	Phoenix Marketcity, Viman Nagar, Pune
•	The Pavillion Mall, SB Road, Pune
•	Phoenix Mall of the Millennium, Wakad, Pune
•	NIBM Road, Pune
•	Sky City Mall, Borivali East, Mumbai
•	Phoenix Marketcity, Kurla, Mumbai
•	Lulu Mall, Lucknow
•	Phoenix Marketcity, Whitefield, Bangalore
•	Nexus Shantiniketan Mall, Whitefield, Bangalore
•	Palladium Mall, Velachery, Chennai

3. Availability & Limits
•	Each participating store has a total of one hundred and one (101) complimentary lab-grown diamonds across the entire offer period. This is 101 total per store, not 101 per day.
•	Diamonds are distributed on a strict first come, first served basis.
•	There is no guarantee of availability. Visiting a store does not entitle a customer to a Free Diamond if stocks at that store have already been exhausted.
•	Pre-registration, form submissions, emails, DMs, social media messages, phone calls, WhatsApp messages, or any other form of prior communication does not reserve, guarantee, or entitle a customer to a Free Diamond.
•	Online registration, website form fills, or expression of interest through any channel does not guarantee availability of the Free Diamond at any store.
•	Solitario will not entertain any claims, complaints, or disputes from customers who arrive at a store after all 101 lab-grown diamonds have been distributed.

4. Loyalty Program Enrolment (Mandatory)
•	To receive the Free Diamond, the customer must scan the QR code available in-store and enrol into the Solitario Loyalty Program by providing the required details.
•	A real-time OTP verification will be sent to the customer's registered mobile number. Successful OTP verification is mandatory before the Free Diamond can be issued.
•	Customers who refuse to enrol in the Loyalty Program or fail OTP verification will not be eligible for the Free Diamond.
•	The mobile number provided must be an active Indian mobile number capable of receiving SMS.

5. The Free Diamond
•	The Free Diamond is a lab grown lab-grown lab-grown diamondselected and provided by Solitario at its sole discretion.
•	The size, shape, cut, carat weight, colour, clarity, and all other specifications of the Free Diamond are determined solely by Solitario and may vary from customer to customer.
•	The Free Diamond cannot be exchanged, upgraded, substituted, returned, or swapped for any other product, variant, size, or specification.
•	The Free Diamond has no cash value and cannot be redeemed for cash, store credit, gift cards, vouchers, or any other form of monetary compensation.
•	The Free Diamond is non-transferable and non-resalable.
•	No complaints, disputes, claims, or requests regarding the size, shape, quality, value, or specifications of the Free Diamond will be entertained.
•	The Free Diamond is provided "as is" and Solitario makes no warranties, express or implied, regarding the Free Diamond beyond it being a lab grown diamond.

6. Documentation & Verification
•	A photograph of the customer receiving the Free Diamond will be taken at the store. Both the customer and the Solitario staff member handing over the lab-grown diamondmust be clearly visible in the photograph.
•	A bill/invoice will be generated through the Solitario billing system for every Free Diamond issued, reflecting a 100% promotional discount.
•	Customers who refuse to be photographed or refuse the billing process will not be issued a Free Diamond.
•	All documentation including bills, photographs, and customer details will be maintained by Solitario for internal audit and verification purposes.

7. Misuse Prevention & Fraud
•	Any attempt to manipulate, game, or exploit the offer through fake identities, multiple claims, borrowed or third-party credit cards, split households, impersonation, bulk claiming, resale intent, or any other fraudulent means is strictly prohibited.
•	Solitario reserves the right to deny, cancel, or revoke any Free Diamond if fraud, misuse, or violation of these Terms & Conditions is suspected, at its sole and absolute discretion.
•	Store staff reserve the right to limit participation, deny the Free Diamond, or request additional identification or verification if suspicious activity is detected.
•	This offer is for end consumers only. Resellers, dealers, jewellery traders, and bulk buyers are not eligible.
•	Any customer found to have obtained a Free Diamond through misrepresentation, impersonation, or fraudulent means may be subject to legal action and recovery of the diamond's value.

8. Limitation of Liability
•	Solitario shall not be held liable for any loss, damage, injury, expense, or inconvenience arising from participation in, or inability to participate in, this offer.
•	Solitario shall not be held responsible for long wait times, crowding, store capacity limits, early exhaustion of lab-grown lab-grown diamondstocks, technical issues with the billing or loyalty system, or any other operational matter.
•	Solitario does not guarantee any specific outcome, experience, or benefit beyond what is expressly stated in these Terms & Conditions.
•	In no event shall Solitario's total liability to any participant exceed the retail value of the Free Diamond offered.
•	Solitario shall not be responsible for any travel, transportation, parking, or other costs incurred by the customer in visiting the store.

9. Modifications & Withdrawal
•	Solitario reserves the right to modify, suspend, extend, or withdraw this offer at any time, without prior notice, at its sole discretion.
•	Solitario reserves the right to change the offer period, the number of Free Diamonds per store, the eligibility criteria, or any other aspect of the offer without prior intimation.
•	Any changes will be communicated through Solitario's official website (www.thesolitario.com) and/or official social media channels. Customers are advised to check for updates before visiting a store.

10. Data & Privacy
•	By participating in this offer, the customer consents to the collection, storage, and use of their personal information (including name, phone number, email, government ID details, credit card holder name, and photograph) for verification, loyalty program enrolment, marketing communications, and audit purposes.
•	Customer photographs taken at the store during the Free Diamond distribution may be used by Solitario for promotional, social media, and marketing purposes, unless the customer explicitly requests otherwise in writing at the time of photography.
•	Solitario will handle all personal data in accordance with applicable Indian data protection laws and its privacy policy available at www.thesolitario.com.
•	Credit card numbers or CVV details will never be recorded, stored, or photographed. Only the cardholder name on the credit card will be verified.

11. Governing Law & Dispute Resolution
•	These Terms & Conditions shall be governed by and construed in accordance with the laws of India.
•	Any disputes arising out of or in connection with this offer shall be subject to the exclusive jurisdiction of the courts in Pune, Maharashtra.
•	In the event of any dispute regarding eligibility, availability, lab-grown lab-grown diamondspecifications, or any other matter related to this offer, the decision of Solitario shall be final and binding.

12. Severability
If any provision of these Terms & Conditions is found to be invalid, illegal, or unenforceable by a court of competent jurisdiction, the remaining provisions shall continue in full force and effect.

13. Entire Agreement
These Terms & Conditions constitute the entire agreement between the customer and Solitario with respect to the Akshaya Tritiya 2026 Free Diamond Offer. No verbal assurances, social media posts, advertisements, influencer communications, in-store verbal promises, or communications from any Solitario employee or representative shall override, modify, or supplement these Terms & Conditions. In the event of any conflict between these Terms & Conditions and any other communication, these Terms & Conditions shall prevail.


`;

const AkshayaRewardSection: React.FC<AkshayaRewardSectionProps> = ({ className = '' }) => {
  const [isAccepted, setIsAccepted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasTracked, setHasTracked] = useState(false);

  useEffect(() => {
    if (isAccepted && !hasTracked) {
      fetch('/api/track/tnc', { method: 'POST' })
        .then(res => {
          if (!res.ok) throw new Error('Tracking response not OK');
          return res.json();
        })
        .then(data => {
          if (data.success) {
            setHasTracked(true);
            // Also track in unified analytics (GA/PostHog) as backup
            trackCustomEvent('AKSHAYA_TNC_ACCEPTED', {
              category: 'Promotion',
              label: 'Akshaya Tritiya 2026'
            });
          }
        })
        .catch(err => console.error('Tracking failed:', err));
    }
  }, [isAccepted, hasTracked]);

  const steps = [
    {
      id: 1,
      title: 'SCAN',
      description: 'Use your smartphone to begin your Solitario experience.',
      icon: <QrCode className="w-6 h-6 text-bronze-gold" />,
    },
    {
      id: 2,
      title: 'JOIN',
      description: 'Sign up & enjoy 1000 reward points instantly.',
      icon: <UserPlus className="w-6 h-6 text-bronze-gold" />,
    },
    {
      id: 3,
      title: 'EARN',
      description: 'Get reward points with every purchase you make.',
      icon: <Coins className="w-6 h-6 text-bronze-gold" />,
    },
    {
      id: 4,
      title: 'REDEEM',
      description: 'Unlock a special diamond reward once you complete your milestones.',
      icon: <Gift className="w-6 h-6 text-bronze-gold" />,
    },
  ];

  return (
    <div className={`w-full max-w-5xl mx-auto ${className}`}>
      <div className="relative bg-gradient-to-br from-[#fdf9f3] to-[#f5efdf] rounded-3xl overflow-hidden border border-bronze-gold/30 shadow-2xl">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-bronze-gold/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-classic-green/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />

        <div className="relative p-6 md:p-10 z-10">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center lg:items-start">
            {/* Left Column: Title & Steps Grid */}
            <div className="flex-1 space-y-8">
              <div className="space-y-2">
                <motion.h2
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-2xl md:text-3xl lg:text-4xl font-montserrat font-bold text-brand-800 leading-tight"
                >
                  <span className="text-classic-green">LOVE DIAMONDS?</span><br />
                  WE REWARD YOU WITH MORE.
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="text-base md:text-lg font-montserrat text-brand-600 tracking-wide font-medium"
                >
                  SHOP MORE, SHINE MORE, EARN MORE.
                </motion.p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                {steps.map((step, idx) => (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: -15 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + idx * 0.1 }}
                    className="flex items-start gap-4 p-3 rounded-xl hover:bg-white/40 transition-colors group border border-transparent hover:border-bronze-gold/10"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white shadow-brand-sm flex items-center justify-center border border-bronze-gold/20 group-hover:scale-110 transition-transform relative">
                      <span className="text-[10px] font-bold text-brand-400 absolute -top-1 -left-1 w-4 h-4 bg-brand-800 text-white rounded-full flex items-center justify-center">
                        {step.id}
                      </span>
                      {React.cloneElement(step.icon as React.ReactElement, { className: "w-5 h-5 text-bronze-gold" })}
                    </div>
                    <div className="space-y-0.5">
                      <h3 className="text-lg font-montserrat font-bold text-brand-800 tracking-tight">{step.title}</h3>
                      <p className="text-sm text-brand-600 font-montserrat leading-snug">{step.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right Column: QR Code & T&C */}
            <div className="flex-shrink-0 w-full sm:w-[340px] space-y-4">
              {/* T&C Checkbox Placement */}
              <div className="p-4 bg-white/60 backdrop-blur-md rounded-2xl border border-bronze-gold/20 shadow-sm animate-fade-in">
                <label className="flex items-start gap-3 cursor-pointer select-none group">
                  <div className="relative flex-shrink-0 mt-0.5">
                    <input
                      type="checkbox"
                      id="tnc-checkbox"
                      checked={isAccepted}
                      onChange={(e) => setIsAccepted(e.target.checked)}
                      className="peer w-5 h-5 rounded border-2 border-bronze-gold/50 text-classic-green focus:ring-0 focus:ring-offset-0 cursor-pointer transition-all appearance-none checked:bg-classic-green checked:border-classic-green"
                    />
                    <svg
                      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="4"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-[11px] md:text-xs font-montserrat text-brand-700 leading-normal">
                    I agree to the <button onClick={(e) => { e.stopPropagation(); setIsModalOpen(true); }} className="text-classic-green font-bold underline hover:text-teal transition-colors">Terms & Conditions</button> for the Free Diamond Offer.
                  </span>
                </label>
              </div>

              {/* QR Card Container */}
              <div className="relative group">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className={`bg-white p-6 rounded-[1.5rem] shadow-brand-lg border border-bronze-gold/20 flex flex-col items-center gap-6 relative overflow-hidden transition-all duration-500 ${!isAccepted ? 'blur-md grayscale opacity-50 select-none pointer-events-none' : 'blur-0 grayscale-0 opacity-100'}`}
                >
                  <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-classic-green via-bronze-gold to-classic-green" />

                  <div className="relative w-full aspect-square max-w-[200px]">
                    <Image
                      src="/images/akshaya-tritiya/akshaya-qr.png"
                      alt="Scan to Join Solitario Rewards"
                      fill
                      className="object-contain"
                    />
                  </div>

                  <div className="w-full space-y-3">
                    <a
                      href="https://solitarioloyalty-member.erlpaas.com/Login"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 bg-brand-800 hover:bg-black text-white font-montserrat font-bold rounded-lg shadow-md hover:shadow-xl transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 uppercase tracking-wider text-sm"
                    >
                      CLICK HERE
                      <ArrowRight className="w-4 h-4 text-bronze-gold" />
                    </a>
                    <p className="text-[10px] text-brand-400 text-center uppercase tracking-[0.15em] font-medium">
                      Powered by Solitario Loyalty Program
                    </p>
                  </div>
                </motion.div>

                {/* Overlay Hint if not accepted */}
                {!isAccepted && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-20 pointer-events-none">
                    <div className="w-12 h-12 bg-white/80 rounded-full flex items-center justify-center mb-3 shadow-lg border border-bronze-gold/30">
                      <ShieldCheck className="w-6 h-6 text-bronze-gold" />
                    </div>
                    <p className="text-sm font-montserrat font-bold text-brand-800 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-lg">
                      Please accept T&C to scan
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* T&C Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Terms & Conditions"
        size="lg"
      >
        <div className="font-montserrat text-sm text-brand-800 space-y-6 leading-relaxed">
          <div className="whitespace-pre-line">
            {TNC_TEXT}
          </div>

          <div className="pt-6 border-t border-brand-200">
            <button
              onClick={() => {
                setIsAccepted(true);
                setIsModalOpen(false);
              }}
              className="w-full py-4 bg-classic-green text-white font-bold rounded-xl hover:bg-teal transition-all shadow-md capitalize"
            >
              I Accept the Terms & Conditions
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AkshayaRewardSection;

