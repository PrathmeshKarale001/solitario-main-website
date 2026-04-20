export interface Campaign {
  id: string;
  name: string;
  status: 'active' | 'completed' | 'upcoming';
  effectiveDate: string;
  lastUpdated: string;
  terms: string;
  slug: string;
}

export const CAMPAIGNS: Campaign[] = [
  {
    id: 'akshaya-tritiya-2026',
    name: 'Akshaya Tritiya 2026 — 10% Off + Free Diamond Offer',
    status: 'active',
    effectiveDate: 'April 17, 2026',
    lastUpdated: 'April 20, 2026',
    slug: 'akshaya-tritiya-2026',
    terms: `AKSHAYA TRITIYA 2026 — 10% OFF + FREE LAB-GROWN DIAMOND OFFER
TERMS & CONDITIONS
Offer Validity: April 17, 2026 to April 23, 2026 (inclusive)
By participating in the Solitario Akshaya Tritiya 2026 Offer described below, you ("Customer", "Participant", "You") acknowledge that you have read, understood, and agree to be bound by these Terms & Conditions. These Terms & Conditions are legally binding.

1. Offer Description & Eligibility
Solitario is offering a flat 10% discount and a complimentary lab-grown diamond ("Free Diamond") to eligible customers during the Akshaya Tritiya 2026 offer period, subject to the following conditions:
•	The offer is valid only on orders with a minimum purchase value of ₹6,999 (Six Thousand Nine Hundred and Ninety-Nine Rupees).
•	The 10% discount applies to the total value of eligible items in the Akshaya Tritiya collection.
•	The Free Diamond is issued only once per qualifying order that meets the minimum threshold.
•	The offer is open to Indian residents aged 18 years and above only.
•	Only one (1) Free Diamond is permitted per person, per family, and per household across the entire campaign period.
•	Solitario staff, employees, their immediate family members, and any persons directly or indirectly associated with the organisation or campaign are not eligible to participate.

2. Offer Period
The offer is valid till stocks last or until April 23, 2026 (23:59:59), whichever is earlier.
•	Online orders must be successfully placed before the end of the offer period.
•	In-store purchases must be completed during regular store operating hours within the offer period.

3. Availability & Limits
•	Complimentary lab-grown diamonds are distributed on a strict first-come, first-served basis.
•	There is no guarantee of availability. Once stocks are exhausted, the "Free Diamond" component of the offer will cease, while the 10% discount may continue at Solitario's discretion.
•	Pre-registration or expression of interest through any channel does not reserve or guarantee a Free Diamond.

4. Loyalty Program Enrolment (Optional/Mandatory)
•	To qualify for the offer, customers may be required to enrol in the Solitario Loyalty Program by providing their mobile number and completing OTP verification.

5. The Free Diamond
•	The Free Diamond is a lab-grown diamond selected and provided by Solitario at its sole discretion.
•	The size, shape, cut, carat weight, colour, clarity, and all other specifications are determined solely by Solitario and may vary.
•	The Free Diamond cannot be exchanged, upgraded, substituted, returned, or swapped for cash or other products.
•	The Free Diamond has no cash value and is non-transferable.

6. Returns & Cancellations
•	If a customer returns or cancels any part of the qualifying order such that the remaining order value falls below the ₹6,999 threshold, both the 10% discount and the Free Diamond will be revoked.
•	The Free Diamond must be returned in its original condition along with any returns of the qualifying purchase.

7. Misuse Prevention & Fraud
•	Any attempt to manipulate the offer through fake identities, multiple claims, or fraudulent means is prohibited.
•	Solitario reserves the right to deny or revoke the offer if misuse is suspected.

8. Limitation of Liability
•	Solitario shall not be held liable for any loss arising from participation or inability to participate in this offer.
•	Solitario does not guarantee any specific outcome or experience beyond what is expressly stated.

9. Modifications & Withdrawal
•	Solitario reserves the right to modify, suspend, or withdraw this offer at any time, without prior notice.
•	Any changes will be communicated through Solitario's official website (www.thesolitario.com).

10. Data & Privacy
•	By participating, the customer consents to the collection of their personal information for verification and marketing purposes.
•	Solitario handles all data in accordance with applicable Indian laws and its privacy policy.

11. Governing Law & Dispute Resolution
•	These Terms & Conditions shall be governed by the laws of India.
•	Any disputes shall be subject to the exclusive jurisdiction of the courts in Pune, Maharashtra.

12. Severability
If any provision is found to be invalid, the remaining provisions shall continue in full force.

13. Entire Agreement
These Terms & Conditions constitute the entire agreement regarding the Akshaya Tritiya 2026 10% Off + Free Diamond Offer. No verbal assurances or social media communications shall override these terms.`
  }
];
