
import React, { createContext, useState, useContext, ReactNode } from 'react';

type Language = 'bn' | 'en';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations: Record<string, { bn: string; en: string }> = {
  // Navbar
  'nav_home': { bn: 'হোম', en: 'Home' },
  'nav_history': { bn: 'ইতিহাস', en: 'History' },
  'nav_schedule': { bn: 'সময়সূচী', en: 'Schedule' },
  'nav_download': { bn: 'কার্ড ডাউনলোড', en: 'Download Card' },
  'nav_register': { bn: 'নিবন্ধন করুন', en: 'Register Now' },
  'school_name': { bn: 'দিঘলী উচ্চ বিদ্যালয়', en: 'Dighali High School' },
  'reunion_title_short': { bn: 'পুনর্মিলনী ২০২৬', en: 'Reunion 2026' },

  // Hero
  'hero_date': { bn: 'ঈদুল ফিতরের ২ দিন পর, ২০২৬', en: '2 Days after Eid-ul-Fitr, 2026' },
  'hero_title_1': { bn: '৯৭ বছরের', en: '97 Years of' },
  'hero_title_2': { bn: 'গৌরবময় পথচলা', en: 'Glorious Journey' },
  'hero_subtitle': { bn: 'দিঘলী উচ্চ বিদ্যালয় প্রাক্তন ছাত্র পুনর্মিলনী (স্থাপিত ১৯২৯)। ঐতিহ্য, বন্ধুত্ব এবং ভবিষ্যতের এক চিরন্তন উদযাপন।', en: 'Dighali High School Alumni Reunion (Est. 1929). An eternal celebration of tradition, friendship, and the future.' },
  'btn_register_now': { bn: 'এখনই নিবন্ধন করুন', en: 'Register Now' },
  'btn_registration_closed': { bn: 'নিবন্ধন বন্ধ আছে', en: 'Registration Closed' },
  'reg_closed_msg': { bn: '৯৭তম পুনর্মিলনী ২০২৬ এর জন্য অনলাইন নিবন্ধন এখনও শুরু হয়নি।', en: 'Online registration for 97th Reunion 2026 has not started yet.' },

  // Countdown
  'count_label': { bn: 'নিবন্ধন শুরু হতে বাকি', en: 'Registration Starts In' },
  'count_mark': { bn: 'ক্যালেন্ডারে মার্ক করে রাখুন:', en: 'Mark your calendar:' },
  'count_date_text': { bn: '০১ ডিসেম্বর, ২০২৫', en: 'December 01, 2025' },
  'day': { bn: 'দিন', en: 'Days' },
  'hour': { bn: 'ঘণ্টা', en: 'Hours' },
  'minute': { bn: 'মিনিট', en: 'Min' },
  'second': { bn: 'সেকেন্ড', en: 'Sec' },

  // Already Registered
  'already_reg_title': { bn: 'ইতিমধ্যে নিবন্ধন করেছেন?', en: 'Already Registered?' },
  'already_reg_desc': { bn: 'আপনি যদি ইতিমধ্যে আপনার নিবন্ধন এবং পেমেন্ট সম্পন্ন করে থাকেন, তাহলে আপনি আপনার অনুমোদনের অবস্থা পরীক্ষা করতে এবং আপনার ডিজিটাল এন্ট্রি কার্ড ডাউনলোড করতে পারেন।', en: 'If you have already completed your registration and payment, you can check your approval status and download your digital entry card.' },
  'btn_download_entry': { bn: 'এন্ট্রি কার্ড ডাউনলোড', en: 'Download Entry Card' },
  'btn_view_schedule': { bn: 'সময়সূচী দেখুন', en: 'View Schedule' },

  // Stats
  'est_label': { bn: '১৯২৯ সাল থেকে', en: 'Since 1929' },
  'our_heritage': { bn: 'আমাদের ঐতিহ্য', en: 'Our Heritage' },
  'stat_est': { bn: 'স্থাপিত', en: 'Established' },
  'stat_alumni': { bn: 'প্রাক্তন শিক্ষার্থী', en: 'Alumni' },
  'stat_anni': { bn: 'বার্ষিকী', en: 'Anniversary' },
  'stat_97th': { bn: '৯৭তম', en: '97th' },

  // Footer
  'footer_desc': { bn: '৯৭ বছরের একাডেমিক শ্রেষ্ঠত্ব এবং আজীবন বন্ধুত্বের উদযাপন। স্থাপিত ১৯২৯।', en: 'Celebrating 97 years of academic excellence and lifelong friendships. Est. 1929.' },
  'copyright': { bn: '২০২৬ পুনর্মিলনী কমিটি। সর্বস্বত্ব সংরক্ষিত।', en: '2026 Reunion Committee. All rights reserved.' },
  'admin_login': { bn: 'অ্যাডমিন প্রবেশ', en: 'Admin Login' },
  'tech_support': { bn: 'কারিগরি সহযোগিতায়', en: 'Tech Support' },

  // Registration Form
  'reg_title': { bn: 'অ্যালামনাই নিবন্ধন', en: 'Alumni Registration' },
  'reg_subtitle': { bn: 'আপনার ডিজিটাল আইডি কার্ড পেতে অনুগ্রহ করে আপনার বিবরণ প্রদান করুন।', en: 'Please provide your details to generate your digital ID card.' },
  'personal_info': { bn: 'ব্যক্তিগত তথ্য', en: 'Personal Information' },
  'info_note': { bn: 'আপনার আইডি কার্ডে এই তথ্যগুলো প্রিন্ট করা হবে।', en: 'This information will be printed on your ID card.' },
  'primary_details': { bn: 'প্রাথমিক বিবরণ', en: 'Primary Details' },
  'full_name': { bn: 'পূর্ণ নাম', en: 'Full Name' },
  'placeholder_name': { bn: 'উদাঃ মোঃ রহিম উদ্দিন', en: 'Ex: Md. Rahim Uddin' },
  'ssc_year': { bn: 'এসএসসি সাল', en: 'SSC Year' },
  'mobile_no': { bn: 'মোবাইল নম্বর', en: 'Mobile Number' },
  'email': { bn: 'ইমেইল (ঐচ্ছিক)', en: 'Email (Optional)' },
  'occupation_addr': { bn: 'পেশা এবং ঠিকানা', en: 'Occupation & Address' },
  'occupation': { bn: 'বর্তমান পেশা', en: 'Current Occupation' },
  'placeholder_occupation': { bn: 'পদবী / ব্যবসা / ছাত্র', en: 'Designation / Business / Student' },
  'present_addr': { bn: 'বর্তমান ঠিকানা', en: 'Present Address' },
  'permanent_addr': { bn: 'স্থায়ী ঠিকানা', en: 'Permanent Address' },
  'same_as_present': { bn: 'বর্তমান ঠিকানার অনুরূপ', en: 'Same as Present' },
  'volunteer_check': { bn: 'আমি স্বেচ্ছাসেবক হতে চাই', en: 'I want to be a Volunteer' },
  'volunteer_desc': { bn: 'আয়োজক দলে যোগ দিন এবং এই অনুষ্ঠানকে সফল করতে সাহায্য করুন!', en: 'Join the organizing team and help make this event a success!' },
  'btn_goto_ticket': { bn: 'টিকেট বুকিং-এ যান', en: 'Go to Ticket Booking' },

  // Ticket Booking
  'ticket_title': { bn: 'আপনার পাস নির্বাচন করুন', en: 'Select Your Pass' },
  'ticket_subtitle': { bn: 'আপনার অংশগ্রহণের পরিকল্পনা অনুযায়ী একটি প্যাকেজ বেছে নিন।', en: 'Choose a package according to your participation plan.' },
  'single_pass': { bn: 'অ্যালামনাই সিঙ্গেল', en: 'Alumni Single' },
  'for_single': { bn: 'একক ব্যক্তির জন্য', en: 'For Single Person' },
  'btn_select_single': { bn: 'সিঙ্গেল পাস নির্বাচন করুন', en: 'Select Single Pass' },
  'couple_pass': { bn: 'কাপল পাস', en: 'Couple Pass' },
  'with_partner': { bn: 'আপনার সঙ্গীকে সাথে নিন', en: 'Bring your partner' },
  'btn_select_couple': { bn: 'কাপল পাস নির্বাচন করুন', en: 'Select Couple Pass' },
  'family_pass': { bn: 'ফ্যামিলি প্যাক', en: 'Family Pack' },
  'full_celebration': { bn: 'পূর্ণাঙ্গ উদযাপন', en: 'Full Celebration' },
  'btn_select_family': { bn: 'ফ্যামিলি পাস নির্বাচন করুন', en: 'Select Family Pass' },
  'person_entry': { bn: 'জনের প্রবেশাধিকার', en: 'Person Entry' },
  'lunch_snacks': { bn: 'লাঞ্চ এবং স্ন্যাকস', en: 'Lunch & Snacks' },
  'souvenir': { bn: 'স্যুভেনির টি-শার্ট', en: 'Souvenir T-Shirt' },
  'raffle': { bn: 'র‍্যাফেল ড্র এন্ট্রি', en: 'Raffle Draw Entry' },
  'gift_set': { bn: 'স্যুভেনির গিফট সেট', en: 'Souvenir Gift Set' },
  'photo_session': { bn: 'কাপল ফটো সেশন', en: 'Couple Photo Session' },
  'premium_lunch': { bn: 'প্রিমিয়াম লাঞ্চ টেবিল', en: 'Premium Lunch Table' },
  'kids_zone': { bn: 'কিডস জোন অ্যাক্সেস', en: 'Kids Zone Access' },
  'family_portrait': { bn: 'ফ্যামিলি পোর্ট্রেট', en: 'Family Portrait' },
  'save': { bn: 'সাশ্রয়', en: 'Save' },
  'best_value': { bn: 'সেরা ভ্যালু', en: 'Best Value' },
  'tshirt_selection': { bn: 'টি-শার্টের সাইজ নির্বাচন', en: 'Select T-Shirt Size' },
  'tshirt_note': { bn: 'পাসের অন্তর্ভুক্ত প্রতিটি সদস্যের জন্য টি-শার্টের সাইজ নির্বাচন করুন।', en: 'Select T-shirt size for each member included in the pass.' },
  'primary_member': { bn: 'প্রাথমিক সদস্য (আপনি)', en: 'Primary Member (You)' },
  'guest_member': { bn: 'অতিথি সদস্য', en: 'Guest Member' },
  'confirm_proceed': { bn: 'নিশ্চিত করুন এবং এগিয়ে যান', en: 'Confirm & Proceed' },

  // Payment
  'payment_title': { bn: 'পেমেন্ট সম্পন্ন করুন', en: 'Complete Payment' },
  'payment_subtitle': { bn: 'যাচাইকরণের জন্য জমা দিতে আপনার নিবন্ধন চূড়ান্ত করুন।', en: 'Finalize your registration to submit for verification.' },
  'back_ticket': { bn: 'টিকেট নির্বাচনে ফিরে যান', en: 'Back to Ticket Selection' },
  'order_summary': { bn: 'অর্ডারের সারাংশ', en: 'Order Summary' },
  'ticket_type': { bn: 'টিকেটের ধরণ', en: 'Ticket Type' },
  'guests': { bn: 'অতিথি', en: 'Guests' },
  'subtotal': { bn: 'সাবটোটাল', en: 'Subtotal' },
  'gateway_fee': { bn: 'গেটওয়ে ফি', en: 'Gateway Fee' },
  'total_payable': { bn: 'সর্বমোট প্রদেয়', en: 'Total Payable' },
  'select_method': { bn: 'পেমেন্ট পদ্ধতি নির্বাচন করুন', en: 'Select Payment Method' },
  'secure_gateway': { bn: 'নিরাপদ পেমেন্ট গেটওয়ে', en: 'Secure Payment Gateway' },
  'payment_instruction': { bn: 'পেমেন্ট নির্দেশনা', en: 'Payment Instructions' },
  'cash_instruction': { bn: 'অনুগ্রহ করে নগদ অর্থ প্রদানের জন্য দিঘলী উচ্চ বিদ্যালয় অফিসে যান অথবা একজন স্বেচ্ছাসেবকের সাথে যোগাযোগ করুন।', en: 'Please visit Dighali High School office or contact a volunteer for cash payment.' },
  'bank_instruction': { bn: 'হিসাবের নাম', en: 'Account Name' },
  'mfs_step_1': { bn: 'আপনার অ্যাপে যান', en: 'Go to your App' },
  'mfs_step_send_money': { bn: 'Send Money অপশন নির্বাচন করুন', en: 'Select Send Money option' },
  'mfs_step_number': { bn: 'নম্বর দিন', en: 'Enter Number' },
  'mfs_step_ref': { bn: 'রেফারেন্স: আপনার নাম', en: 'Reference: Your Name' },
  'sender_number': { bn: 'প্রেরকের নম্বর', en: 'Sender Number' },
  'trx_id': { bn: 'ট্রানজ্যাকশন আইডি (TrxID)', en: 'Transaction ID (TrxID)' },
  'btn_submit_verify': { bn: 'যাচাইকরণের জন্য জমা দিন', en: 'Submit for Verification' },
  'processing': { bn: 'জমা হচ্ছে...', en: 'Processing...' },

  // Status Check
  'check_title': { bn: 'প্রবেশপত্র ডাউনলোড', en: 'Download Entry Card' },
  'check_subtitle': { bn: 'আপনার স্ট্যাটাস চেক করতে এবং আইডি কার্ড ডাউনলোড করতে আপনার বিবরণ দিন।', en: 'Enter your details to check status and download ID card.' },
  'btn_find_card': { bn: 'কার্ড খুঁজুন', en: 'Find Card' },
  'searching': { bn: 'অনুসন্ধান চলছে...', en: 'Searching...' },
  'status_pending_title': { bn: 'পেমেন্ট পর্যালোচনার অধীনে আছে', en: 'Payment Under Review' },
  'status_pending_desc': { bn: 'আমরা আপনার জমা দেওয়া তথ্য পেয়েছি। অ্যাডমিন টিম বর্তমানে আপনার পেমেন্ট ট্রানজ্যাকশন যাচাই করছে।', en: 'We received your information. Admin team is verifying your payment transaction.' },
  'check_later': { bn: 'অনুগ্রহ করে কিছুক্ষণ পর আবার চেক করুন।', en: 'Please check back later.' },
  'check_another': { bn: 'অন্য নম্বর চেক করুন', en: 'Check Another Number' },
  'not_found_error': { bn: 'এই তথ্যের সাথে কোনো নিবন্ধন পাওয়া যায়নি। অনুগ্রহ করে চেক করুন এবং আবার চেষ্টা করুন।', en: 'No registration found with this information. Please check and try again.' },
  'connection_error': { bn: 'সংযোগ ত্রুটি। অনুগ্রহ করে আবার চেষ্টা করুন।', en: 'Connection error. Please try again.' },
  'rejected_error': { bn: 'এই নিবন্ধনটি প্রত্যাখ্যান করা হয়েছে। অনুগ্রহ করে সাপোর্টে যোগাযোগ করুন।', en: 'This registration has been rejected. Please contact support.' },
  'select_year_prompt': { bn: 'সাল নির্বাচন করুন', en: 'Select Year' },

  // ID Card
  'reg_success': { bn: 'আপনার নিবন্ধন সফল হয়েছে!', en: 'Registration Successful!' },
  'upload_photo_msg': { bn: 'আপনার কার্ডটি সম্পূর্ণ করতে নিজের ছবি আপলোড করুন।', en: 'Upload your photo to complete the card.' },
  'click_upload': { bn: 'ছবি আপলোড করতে ক্লিক করুন', en: 'Click to upload photo' },
  'btn_print': { bn: 'প্রিন্ট করুন', en: 'Print' },
  'btn_pdf': { bn: 'পিডিএফ সংরক্ষণ', en: 'Save PDF' },
  'btn_invoice': { bn: 'ইনভয়েস ডাউনলোড', en: 'Download Invoice' },
  'generating': { bn: 'তৈরি হচ্ছে...', en: 'Generating...' },
  'card_est': { bn: 'স্থাপিত ১৯২৯', en: 'EST. 1929' },
  'card_batch': { bn: 'ব্যাচ', en: 'BATCH' },
  'card_guest': { bn: 'অতিথি', en: 'GUESTS' },
  'card_volunteer': { bn: 'স্বেচ্ছাসেবক', en: 'VOLUNTEER' },
  'card_footer': { bn: 'অনুমোদিত প্রবেশ • ৯৭ বছর', en: 'AUTHORIZED ENTRY • 97 YEARS' },
  'ai_memory_title': { bn: 'স্মৃতির পাতা থেকে', en: 'Memory Lane' },
  'ai_generated': { bn: 'AI জেনারেটেড', en: 'AI Generated' },
  'memory_prompt': { bn: '"মনে আছে সেই দিনের কথা?"', en: '"Remember the days?"' },
  'pop_song': { bn: 'জনপ্রিয় গান', en: 'Popular Song' },
  'pop_movie': { bn: 'জনপ্রিয় সিনেমা', en: 'Popular Movie' },
  'no_memory_data': { bn: 'স্মৃতির তথ্য পাওয়া যায়নি।', en: 'No memory data found.' },

  // Schedule
  'schedule_title': { bn: 'অনুষ্ঠানের সময়সূচী', en: 'Event Schedule' },
  'schedule_subtitle': { bn: 'আনন্দ, হাসি এবং স্মৃতিবিজড়িত একটি দিনের জন্য আমাদের সাথে যোগ দিন।', en: 'Join us for a day full of joy, laughter and memories.' },
  'event_reg': { bn: 'রেজিস্ট্রেশন ও কিট সংগ্রহ', en: 'Registration & Kit Collection' },
  'event_rally': { bn: 'বর্ণাঢ্য র‍্যালি', en: 'Grand Rally' },
  'event_opening': { bn: 'উদ্বোধনী অনুষ্ঠান', en: 'Opening Ceremony' },
  'event_lunch': { bn: 'মধ্যাহ্নভোজ ও বিরতি', en: 'Lunch Break' },
  'event_memory': { bn: 'স্মৃতিচারণ পর্ব', en: 'Reminiscence Session' },
  'event_cultural': { bn: 'সাংস্কৃতিক সন্ধ্যা', en: 'Cultural Night' },
  'event_raffle': { bn: 'র‍্যাফেল ড্র ও সমাপ্তি', en: 'Raffle Draw & Closing' },
  'help_needed': { bn: 'সাহায্য প্রয়োজন?', en: 'Need Help?' },
  'help_desc': { bn: 'আমাদের স্বেচ্ছাসেবক দল ক্যাম্পাসের সর্বত্র আপনাকে গাইড করার জন্য উপস্থিত থাকবে।', en: 'Our volunteer team will be present throughout the campus to guide you.' },
  'contact_us': { bn: 'যোগাযোগ করুন', en: 'Contact Us' },

  // About Us
  'since_1929': { bn: '১৯২৯ থেকে পথচলা', en: 'Journey Since 1929' },
  'our_heritage_title': { bn: 'আমাদের ঐতিহ্য', en: 'Our Heritage' },
  'school_location': { bn: 'লক্ষ্মীপুর সদর', en: 'Lakshmipur Sadar' },
  'history_p1': { bn: 'লক্ষ্মীপুর সদর উপজেলাধীন দিঘলী ইউনিয়নের কেন্দ্রবিন্দু দিঘলী বাজার সংলগ্ন প্রাচীর বেষ্টিত এক মনোরম প্রাকৃতিক দখিনা পরিবেশে দিঘলী উচ্চ বিদ্যালয়টি ১/১/১৯২৯ ই. সালে প্রতিষ্ঠিত।', en: 'Dighali High School was established on 1/1/1929 in a beautiful natural southern environment surrounded by walls adjacent to Dighali Bazar, the center of Dighali Union under Lakshmipur Sadar Upazila.' },
  'history_quote': { bn: '"মানব হিতৈষী ও বিশিষ্ট শিক্ষানুরাগী মরহুম আলহাজ্ব আনছার উদ্দিন আহমেদ নদীগরবে বিলীন প্রায় বিদ্যালয়টিকে বর্তমান স্থানে প্রতিষ্ঠা করেন।"', en: '"Late Alhaj Ansar Uddin Ahmed, a philanthropist and distinguished educationist, established the school at its current location after it was nearly lost to river erosion."' },
  'history_p2': { bn: 'এলাকার দরিদ্র সাধারণের সন্তানদের মাঝে সুদীর্ঘ ৯৭ বছর যাবত শিক্ষার আলো ছড়িয়ে যাচ্ছে। যাদের মধ্যে অনেক ছাত্র-ছাত্রী সরকারী-বেসরকারী পর্যায়ে বড় বড় দায়িত্ব পালনের করছে এবং করেছে।', en: 'For 97 long years, it has been spreading the light of education among the children of the poor common people of the area. Many of its students are serving and have served in high positions in government and non-government sectors.' },
  'recognition_title': { bn: 'স্বীকৃতি ও ফলাফল', en: 'Recognition & Results' },
  'recognition_desc': { bn: 'প্রাপ্ত রেকড অনুযায়ী ০১/০১/১৯৫৯ ই. তারিখ হতে শিক্ষা বোর্ডের স্বীকৃতি লাভ করে। বিদ্যালয়ের অভ্যন্তরীণ ও পাবলিক পরীক্ষার ফলাফল যথেষ্ট ভাল।', en: 'According to available records, it received recognition from the Education Board from 01/01/1959. The school\'s internal and public examination results are quite good.' },
  'co_curricular_title': { bn: 'সহশিক্ষা কার্যক্রম', en: 'Co-curricular Activities' },
  'co_curricular_desc': { bn: 'সহপাঠক্রম ও প্রযুক্তিগত দিক থেকেও বিদ্যালয়টি এগিয়ে আছে।', en: 'The school is also ahead in co-curricular and technological aspects.' },

  // Admin
  'admin_panel': { bn: 'অ্যাডমিন প্যানেল', en: 'Admin Panel' },
  'admin_subtitle': { bn: 'শুধুমাত্র অনুমোদিত ব্যক্তিদের জন্য', en: 'For Authorized Personnel Only' },
  'password': { bn: 'পাসওয়ার্ড', en: 'Password' },
  'password_placeholder': { bn: 'অ্যাডমিন পাসওয়ার্ড দিন', en: 'Enter Admin Password' },
  'invalid_pass': { bn: 'ভুল পাসওয়ার্ড', en: 'Invalid Password' },
  'enter_dashboard': { bn: 'ড্যাশবোর্ডে প্রবেশ করুন', en: 'Enter Dashboard' },
  'dashboard_title': { bn: 'অ্যাডমিন ড্যাশবোর্ড', en: 'Admin Dashboard' },
  'dashboard_desc': { bn: 'নিবন্ধন ব্যবস্থাপনা এবং পেমেন্ট যাচাইকরণ।', en: 'Registration management and payment verification.' },
  'scan_ticket': { bn: 'টিকেট স্ক্যান', en: 'Scan Ticket' },
  'pending': { bn: 'অপেক্ষমাণ', en: 'Pending' },
  'revenue': { bn: 'রাজস্ব', en: 'Revenue' },
  'search_placeholder': { bn: 'নাম, মোবাইল বা TrxID দিয়ে খুঁজুন...', en: 'Search by Name, Mobile or TrxID...' },
  'status': { bn: 'স্ট্যাটাস', en: 'Status' },
  'student_info': { bn: 'শিক্ষার্থী তথ্য', en: 'Student Info' },
  'ticket': { bn: 'টিকেট', en: 'Ticket' },
  'payment_info': { bn: 'পেমেন্ট তথ্য', en: 'Payment Info' },
  'amount': { bn: 'পরিমাণ', en: 'Amount' },
  'action': { bn: 'পদক্ষেপ', en: 'Action' },
  'no_data': { bn: 'কোনো নিবন্ধন পাওয়া যায়নি।', en: 'No registrations found.' },
  'approve': { bn: 'অনুমোদন', en: 'Approve' },
  'reject': { bn: 'প্রত্যাখ্যান', en: 'Reject' },
  'completed': { bn: 'সম্পন্ন', en: 'Completed' },
  'scan_result': { bn: 'স্ক্যান ফলাফল', en: 'Scan Result' },
  'scanning': { bn: 'টিকেট স্ক্যান হচ্ছে...', en: 'Scanning Ticket...' },
  'valid_entry': { bn: 'অনুমোদিত প্রবেশ', en: 'Authorized Entry' },
  'entry_allowed': { bn: 'প্রবেশের জন্য অনুমোদিত।', en: 'Allowed for entry.' },
  'payment_pending': { bn: 'পেমেন্ট অপেক্ষমাণ', en: 'Payment Pending' },
  'payment_pending_msg': { bn: 'টিকেটটি বৈধ কিন্তু পেমেন্ট এখনও যাচাই করা হয়নি।', en: 'Ticket is valid but payment is not verified yet.' },
  'invalid_ticket': { bn: 'অবৈধ টিকেট', en: 'Invalid Ticket' },
  'invalid_msg': { bn: 'টিকেট আইডি ডাটাবেসে পাওয়া যায়নি।', en: 'Ticket ID not found in database.' },
  'rejected_msg': { bn: 'এই নিবন্ধনটি পূর্বে প্রত্যাখ্যান করা হয়েছে।', en: 'This registration was previously rejected.' },
  'scan_again': { bn: 'আবার স্ক্যান করুন', en: 'Scan Again' },

  // Live Chat
  'live_chat': { bn: 'লাইভ চ্যাট', en: 'Live Chat' },
  'ai_moderated': { bn: 'AI দ্বারা নিয়ন্ত্রিত', en: 'AI Moderated' },
  'join_chat': { bn: 'কথপোকথনে যোগ দিন', en: 'Join Conversation' },
  'your_name': { bn: 'আপনার নাম', en: 'Your Name' },
  'name_placeholder': { bn: 'যেমন: রহিম', en: 'Ex: Rahim' },
  'batch_year': { bn: 'ব্যাচ (সাল)', en: 'Batch (Year)' },
  'select': { bn: 'নির্বাচন করুন', en: 'Select' },
  'enter_chat': { bn: 'চ্যাটে প্রবেশ করুন', en: 'Enter Chat' },
  'write_msg': { bn: 'মেসেজ লিখুন...', en: 'Write a message...' },
  'open_chat': { bn: 'চ্যাট করুন', en: 'Chat Now' },

  // Success Page
  'reg_submitted': { bn: 'নিবন্ধন জমা দেওয়া হয়েছে!', en: 'Registration Submitted!' },
  'reg_submitted_msg': { bn: 'ধন্যবাদ। আপনার পেমেন্ট অ্যাডমিন টিমের পর্যালোচনার জন্য জমা হয়েছে। অনুমোদিত হলে আপনি আপনার আইডি কার্ড ডাউনলোড করতে পারবেন।', en: 'Thank you. Your payment is under review by the admin team. Once approved, you can download your ID card.' },
  
  // PWA
  'install_app': { bn: 'অ্যাপ ইনস্টল করুন', en: 'Install App' },
  'install_desc': { bn: 'ভালো অভিজ্ঞতার জন্য অ্যাপটি ব্যবহার করুন', en: 'Use the app for better experience' },
  'install': { bn: 'ইনস্টল', en: 'Install' },

  // AI Assistant
  'ai_welcome': { bn: 'হ্যালো! আমি হাবিব, আপনার পুনর্মিলনী সহায়ক। আমি আপনাকে কীভাবে সাহায্য করতে পারি?', en: 'Hello! I am Habib, your reunion assistant. How can I help you?' },
  'ai_sugg_price': { bn: 'টিকেটের মূল্য কত?', en: 'Ticket Prices?' },
  'ai_sugg_reg': { bn: 'কীভাবে নিবন্ধন করব?', en: 'How to register?' },
  'ai_sugg_schedule': { bn: 'অনুষ্ঠানের সময়সূচী', en: 'Event Schedule' },
  'ai_sugg_history': { bn: 'বিদ্যালয়ের ইতিহাস', en: 'School History' },
  'ask_something': { bn: 'কিছু জিজ্ঞাসা করুন...', en: 'Ask something...' },
  'chat_with_habib': { bn: 'হাবিবের সাথে চ্যাট করুন', en: 'Chat with Habib' },
  'ai_error': { bn: 'দুঃখিত, একটি ত্রুটি হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।', en: 'Sorry, an error occurred. Please try again.' },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('bn');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'bn' ? 'en' : 'bn');
  };

  const t = (key: string) => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
