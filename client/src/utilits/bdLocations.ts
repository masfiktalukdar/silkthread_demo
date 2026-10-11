export interface District {
  name: string;
  thanas: string[];
}

export interface Division {
  name: string;
  districts: District[];
}

export const BD_LOCATIONS: Division[] = [
  {
    name: "Dhaka / ঢাকা",
    districts: [
      {
        name: "Dhaka / ঢাকা",
        thanas: [
          "Mirpur / মিরপুর",
          "Uttara / উত্তরা",
          "Dhanmondi / ধানমন্ডি",
          "Gulshan / গুলশান",
          "Banani / বনানী",
          "Mohammadpur / মোহাম্মদপুর",
          "Motijheel / মতিঝিল",
          "Tejgaon / তেজগাঁও",
          "Badda / বাড্ডা",
          "Rampura / রামপুরা",
          "Khilgaon / খিলগাঁও",
          "Paltan / পল্টন",
          "Shahbagh / শাহবাগ",
          "Lalbagh / লালবাগ",
          "Kotwali / কোতোয়ালী",
          "Sutrapur / সূত্রাপুর",
          "Wari / ওয়ারী",
          "Jatrabari / যাত্রাবাড়ী",
          "Demra / ডেমরা",
          "Shampur / শ্যামপুর",
          "Kamrangirchar / কামরাঙ্গীরচর",
          "Hazaribagh / হাজারীবাগ",
          "New Market / নিউ মার্কেট",
          "Kafrul / কাফরুল",
          "Cantonment / সেনানিবাস",
          "Khilkhet / খিলক্ষেত",
          "Vatara / ভাটারা",
          "Mohakhali / মহাখালী",
          "Savar / সাভার",
          "Ashulia / আশুলিয়া",
          "Keraniganj / কেরানীগঞ্জ",
          "Dhamrai / ধামরাই",
          "Dohar / দোহার",
          "Nawabganj / নবাবগঞ্জ"
        ]
      },
      {
        name: "Gazipur / গাজীপুর",
        thanas: [
          "Gazipur Sadar / গাজীপুর সদর",
          "Tongi / টঙ্গী",
          "Kaliakair / কালিয়াকৈর",
          "Kapasia / কাপাসিয়া",
          "Sreepur / শ্রীপুর",
          "Kaliganj / কালীগঞ্জ"
        ]
      },
      {
        name: "Narayanganj / নারায়ণগঞ্জ",
        thanas: [
          "Narayanganj Sadar / নারায়ণগঞ্জ সদর",
          "Bandar / বন্দর",
          "Fatullah / ফতুল্লা",
          "Siddhirganj / সিদ্ধিরগঞ্জ",
          "Rupganj / রূপগঞ্জ",
          "Sonargaon / সোনারগাঁও",
          "Araihazar / আড়াইহাজার"
        ]
      },
      {
        name: "Tangail / টাঙ্গাইল",
        thanas: [
          "Tangail Sadar / টাঙ্গাইল সদর",
          "Mirzapur / মির্জাপুর",
          "Nagarpur / নাগরপুর",
          "Delduar / দেলদুয়ার",
          "Basail / বাসাইল",
          "Sakhipur / সখিপুর",
          "Ghatail / ঘাটাইল",
          "Kalihati / কালিহাতী",
          "Madhupur / মধুপুর",
          "Gopalpur / গোপালপুর",
          "Bhuapur / ভূঞাপুর",
          "Dhanbari / ধনবাড়ী"
        ]
      },
      {
        name: "Kishoreganj / কিশোরগঞ্জ",
        thanas: [
          "Kishoreganj Sadar / কিশোরগঞ্জ সদর",
          "Bhairab / ভৈরব",
          "Bajitpur / বাজিতপুর",
          "Katiadi / কটিয়াদী",
          "Karimganj / করিমগঞ্জ",
          "Pakundia / পাকুন্দিয়া",
          "Tarail / তাড়াইল",
          "Hossainpur / হোসেনপুর",
          "Kuliarchar / কুলিয়ারচর",
          "Itna / ইটনা",
          "Mithamain / মিঠামইন",
          "Austagram / অষ্টগ্রাম",
          "Nikli / নিকলী"
        ]
      },
      {
        name: "Manikganj / মানিকগঞ্জ",
        thanas: [
          "Manikganj Sadar / মানিকগঞ্জ সদর",
          "Saturia / সাটুরিয়া",
          "Singair / সিঙ্গাইর",
          "Shibalaya / শিবালয়",
          "Ghior / ঘিওর",
          "Harirampur / হরিরামপুর",
          "Daulatpur / দৌলতপুর"
        ]
      },
      {
        name: "Munshiganj / মুন্সীগঞ্জ",
        thanas: [
          "Munshiganj Sadar / মুন্সীগঞ্জ সদর",
          "Sreenagar / শ্রীনগর",
          "Sirajdikhan / সিরাজদিখান",
          "Louhajang / লৌহজং",
          "Tongibari / টঙ্গীবাড়ী",
          "Gazaria / গজারিয়া"
        ]
      },
      {
        name: "Narsingdi / নরসিংদী",
        thanas: [
          "Narsingdi Sadar / নরসিংদী সদর",
          "Palash / পলাশ",
          "Shibpur / শিবপুর",
          "Belabo / বেলাবো",
          "Monohardi / মনোহরদী",
          "Raipura / রায়পুরা"
        ]
      },
      {
        name: "Faridpur / ফরিদপুর",
        thanas: [
          "Faridpur Sadar / ফরিদপুর সদর",
          "Boalmari / বোয়ালমারী",
          "Alfadanga / আলফাডাঙ্গা",
          "Madhukhali / মধুখালী",
          "Bhanga / ভাঙ্গা",
          "Nagarkanda / নগরকান্দা",
          "Charbhadrasan / চরভদ্রাসন",
          "Sadarpur / সদরপুর",
          "Saltha / সালথা"
        ]
      },
      {
        name: "Gopalganj / গোপালগঞ্জ",
        thanas: [
          "Gopalganj Sadar / গোপালগঞ্জ সদর",
          "Kashiani / কাশিয়ানী",
          "Kotalipara / কোটালীপাড়া",
          "Muksudpur / মুকসুদপুর",
          "Tungipara / টুঙ্গিপাড়া"
        ]
      },
      {
        name: "Madaripur / মাদারীপুর",
        thanas: [
          "Madaripur Sadar / মাদারীপুর সদর",
          "Shibchar / শিবচর",
          "Kalkini / কালকিনি",
          "Rajoir / রাজৈর",
          "Dasar / ডাসার"
        ]
      },
      {
        name: "Rajbari / রাজবাড়ী",
        thanas: [
          "Rajbari Sadar / রাজবাড়ী সদর",
          "Goalanda / গোয়ালন্দ",
          "Pangsha / পাংশা",
          "Baliakandi / বালিয়াকান্দি",
          "Kalukhali / কালুখালী"
        ]
      },
      {
        name: "Shariatpur / শরীয়তপুর",
        thanas: [
          "Shariatpur Sadar / শরীয়তপুর সদর",
          "Zajira / জাজিরা",
          "Naria / নড়িয়া",
          "Bhedarganj / ভেদরগঞ্জ",
          "Damudya / ডামুড্যা",
          "Gosairhat / গোসাইরহাট"
        ]
      }
    ]
  },
  {
    name: "Chattogram / চট্টগ্রাম",
    districts: [
      {
        name: "Chattogram / চট্টগ্রাম",
        thanas: [
          "Kotwali / কোতোয়ালী",
          "Panchlaish / পাঁচলাইশ",
          "Khulshi / খুলশী",
          "Halishahar / হালিশহর",
          "Double Mooring / ডবলমুরিং",
          "Pahartali / পাহাড়তলী",
          "Bakalia / বাকলিয়া",
          "Chandgaon / চান্দগাঁও",
          "Patenga / পতেঙ্গা",
          "Bayazid / বায়েজিদ",
          "Hathazari / হাটহাজারী",
          "Sitakunda / সীতাকুণ্ড",
          "Mirsharai / মীরসরাই",
          "Patiya / পটিয়া",
          "Raozan / রাউজান",
          "Rangunia / রাঙ্গুনিয়া",
          "Boalkhali / বোয়ালখালী",
          "Anwara / আনোয়ারা",
          "Chandanaish / চন্দনাইশ",
          "Satkania / সাতকানিয়া",
          "Lohagara / লোহাগাড়া",
          "Banshkhali / বাঁশখালী",
          "Fatikchhari / ফটিকছড়ি",
          "Karnaphuli / কর্ণফুলী",
          "Sandwip / সন্দ্বীপ"
        ]
      },
      {
        name: "Cox's Bazar / কক্সবাজার",
        thanas: [
          "Cox's Bazar Sadar / কক্সবাজার সদর",
          "Ramu / রামু",
          "Chakaria / চকরিয়া",
          "Teknaf / টেকনাফ",
          "Ukhia / উখিয়া",
          "Pekua / পেকুয়া",
          "Maheshkhali / মহেশখালী",
          "Kutubdia / কুতুবদিয়া",
          "Eidgaon / ঈদগাঁও"
        ]
      },
      {
        name: "Cumilla / কুমিল্লা",
        thanas: [
          "Cumilla Adarsha Sadar / কুমিল্লা আদর্শ সদর",
          "Cumilla Sadar Dakshin / কুমিল্লা সদর দক্ষিণ",
          "Daudkandi / দাউদকান্দি",
          "Chandina / চান্দিনা",
          "Debidwar / দেবিদ্বার",
          "Homna / হোমনা",
          "Muradnagar / মুরাদনগর",
          "Barura / বরুড়া",
          "Burichang / বুড়িচং",
          "Brahmanpara / ব্রাহ্মণপাড়া",
          "Chauddagram / চৌদ্দগ্রাম",
          "Laksam / লাকসাম",
          "Monohorganj / মনোহরগঞ্জ",
          "Meghna / মেঘনা",
          "Titas / তিতাস",
          "Nangalkot / নাঙ্গলকোট",
          "Lalmai / লালমাই"
        ]
      },
      {
        name: "Feni / ফেনী",
        thanas: [
          "Feni Sadar / ফেনী সদর",
          "Daganbhuiyan / দাগনভূঞা",
          "Chhagalnaiya / ছাগলনাইয়া",
          "Sonagazi / সোনাগাজী",
          "Parshuram / পরশুরাম",
          "Fulgazi / ফুলগাজী"
        ]
      },
      {
        name: "Brahmanbaria / ব্রাহ্মণবাড়িয়া",
        thanas: [
          "Brahmanbaria Sadar / ব্রাহ্মণবাড়িয়া সদর",
          "Kasba / কসবা",
          "Nasirnagar / নাসিরনগর",
          "Sarail / সরাইল",
          "Ashuganj / আশুগঞ্জ",
          "Akhaura / আখাউড়া",
          "Nabinagar / নবীনগর",
          "Bancharampur / বাঞ্ছারামপুর",
          "Bijoynagar / বিজয়নগর"
        ]
      },
      {
        name: "Chandpur / চাঁদপুর",
        thanas: [
          "Chandpur Sadar / চাঁদপুর সদর",
          "Faridganj / ফরিদগঞ্জ",
          "Haimchar / হাইমচর",
          "Haziganj / হাজীগঞ্জ",
          "Kachua / কচুয়া",
          "Matlab Dakshin / মতলব দক্ষিণ",
          "Matlab Uttar / মতলব উত্তর",
          "Shahrasti / শাহরাস্তি"
        ]
      },
      {
        name: "Noakhali / নোয়াখালী",
        thanas: [
          "Noakhali Sadar / নোয়াখালী সদর",
          "Begumganj / বেগমগঞ্জ",
          "Chatkhil / চাটখিল",
          "Companiganj / কোম্পানীগঞ্জ",
          "Hatiya / হাতিয়া",
          "Senbagh / সেনবাগ",
          "Sonaimuri / সোনাইমুড়ী",
          "Subarnachar / সুবর্ণচর",
          "Kabirhat / কবিরহাট"
        ]
      },
      {
        name: "Lakshmipur / লক্ষ্মীপুর",
        thanas: [
          "Lakshmipur Sadar / লক্ষ্মীপুর সদর",
          "Raipur / রায়পুর",
          "Ramganj / রামগঞ্জ",
          "Ramgati / রামগতি",
          "Kamalnagar / কমলনগর"
        ]
      },
      {
        name: "Bandarban / বান্দরবান",
        thanas: [
          "Bandarban Sadar / বান্দরবান সদর",
          "Ruma / রুমা",
          "Thanchi / থানচি",
          "Lama / লামা",
          "Alikadam / আলীকদম",
          "Rowangchhari / রোয়াংছড়ি",
          "Naikhongchhari / নাইক্ষ্যংছড়ি"
        ]
      },
      {
        name: "Khagrachhari / খাগড়াছড়ি",
        thanas: [
          "Khagrachhari Sadar / খাগড়াছড়ি সদর",
          "Dighinala / দিঘীনালা",
          "Panchhari / পানছড়ি",
          "Mahalchhari / মহালছড়ি",
          "Matiranga / মাটিরাঙ্গা",
          "Manikchhari / মানিকছড়ি",
          "Ramgarh / রামগড়",
          "Lakshmichhari / লক্ষ্মীছড়ি",
          "Guimara / গুইমারা"
        ]
      },
      {
        name: "Rangamati / রাঙ্গামাটি",
        thanas: [
          "Rangamati Sadar / রাঙ্গামাটি সদর",
          "Kaptai / কাপ্তাই",
          "Baghaichhari / বাঘাইছড়ি",
          "Barkal / বরকল",
          "Langadu / লংগদু",
          "Rajasthali / রাজস্থলী",
          "Belaichhari / বিলাইছড়ি",
          "Juraichhari / জুরাছড়ি",
          "Naniarchar / নানিয়ারচর",
          "Kawkhali / কাউখালী"
        ]
      }
    ]
  },
  {
    name: "Rajshahi / রাজশাহী",
    districts: [
      {
        name: "Rajshahi / রাজশাহী",
        thanas: [
          "Boalia / বোয়ালিয়া",
          "Motihar / মতিহার",
          "Rajpara / রাজপাড়া",
          "Shah Makhdum / শাহ মখদুম",
          "Paba / পবা",
          "Godagari / গোদাগাড়ী",
          "Tanore / তানোর",
          "Mohanpur / মোহনপুর",
          "Bagmara / বাগমারা",
          "Durgapur / দুর্গাপুর",
          "Puthia / পুঠিয়া",
          "Charghat / চারঘাট",
          "Bagha / বাঘা"
        ]
      },
      {
        name: "Bogura / বগুড়া",
        thanas: [
          "Bogura Sadar / বগুড়া সদর",
          "Shajahanpur / শাজাহানপুর",
          "Sherpur / শেরপুর",
          "Shibganj / শিবগঞ্জ",
          "Gabtali / গাবতলী",
          "Kahaloo / কাহালু",
          "Nandigram / নন্দীগ্রাম",
          "Dhunat / ধুনট",
          "Sariakandi / সারিয়াকান্দি",
          "Sonatala / সোনাতলা",
          "Adamdighi / আদমদীঘি",
          "Dupchanchia / দুপচাঁচিয়া"
        ]
      },
      {
        name: "Pabna / পাবনা",
        thanas: [
          "Pabna Sadar / পাবনা সদর",
          "Ishwardi / ঈশ্বরদী",
          "Atgharia / আটঘরিয়া",
          "Chatmohar / চাটমোহর",
          "Bhangura / ভাঙ্গুড়া",
          "Faridpur / ফরিদপুর",
          "Bera / বেড়া",
          "Santhia / সাঁথিয়া",
          "Sujanagar / সুজানগর"
        ]
      },
      {
        name: "Sirajganj / সিরাজগঞ্জ",
        thanas: [
          "Sirajganj Sadar / সিরাজগঞ্জ সদর",
          "Kazipur / কাজীপুর",
          "Ullapara / উল্লাপাড়া",
          "Shahjadpur / শাহজাদপুর",
          "Raiganj / রায়গঞ্জ",
          "Tarash / তাড়াশ",
          "Belkuchi / বেলকুচি",
          "Kamarkhanda / কামারখন্দ",
          "Chauhali / চৌহালী"
        ]
      },
      {
        name: "Naogaon / নওগাঁ",
        thanas: [
          "Naogaon Sadar / নওগাঁ সদর",
          "Mohadevpur / মহাদেবপুর",
          "Manda / মান্দা",
          "Patnitala / পত্নীতলা",
          "Dhamoirhat / ধামইরহাট",
          "Sapahar / সাপাহার",
          "Porsha / পোরশা",
          "Niamatpur / নিয়ামতপুর",
          "Raninagar / রানীনগর",
          "Atrai / আত্রাই",
          "Badalgachhi / বদলগাছী"
        ]
      },
      {
        name: "Natore / নাটোর",
        thanas: [
          "Natore Sadar / নাটোর সদর",
          "Singra / সিংড়া",
          "Baraigram / বড়াইগ্রাম",
          "Bagatipara / বাগাতিপাড়া",
          "Lalpur / লালপুর",
          "Gurudaspur / গুরুদাসপুর",
          "Naldanga / নলডাঙ্গা"
        ]
      },
      {
        name: "Chapai Nawabganj / চাঁপাইনবাবগঞ্জ",
        thanas: [
          "Chapai Nawabganj Sadar / চাঁপাইনবাবগঞ্জ সদর",
          "Shibganj / শিবগঞ্জ",
          "Gomastapur / গোমস্তাপুর",
          "Nachole / নাচোল",
          "Bholahat / ভোলাহাট"
        ]
      },
      {
        name: "Joypurhat / জয়পুরহাট",
        thanas: [
          "Joypurhat Sadar / জয়পুরহাট সদর",
          "Panchbibi / পাঁচবিবি",
          "Kalai / কালাই",
          "Khetlal / ক্ষেতলাল",
          "Akkelpur / আক্কেলপুর"
        ]
      }
    ]
  },
  {
    name: "Khulna / খুলনা",
    districts: [
      {
        name: "Khulna / খুলনা",
        thanas: [
          "Khulna Sadar / খুলনা সদর",
          "Sonadanga / সোনাডাঙ্গা",
          "Khalishpur / খালিশপুর",
          "Daulatpur / দৌলতপুর",
          "Khan Jahan Ali / খান জাহান আলী",
          "Kotwali / কোতোয়ালী",
          "Dumuria / ডুমুরিয়া",
          "Batiaghata / বটিয়াঘাটা",
          "Rupsha / রূপসা",
          "Phultala / ফুলতলা",
          "Dighalia / দিঘলিয়া",
          "Terokhada / তেরখাদা",
          "Paikgachha / পাইকগাছা",
          "Dacope / দাকোপ",
          "Koyra / কয়রা"
        ]
      },
      {
        name: "Jashore / যশোর",
        thanas: [
          "Jashore Sadar / যশোর সদর",
          "Jhikargachha / ঝিকরগাছা",
          "Sharsha / শার্শা",
          "Manirampur / মণিরামপুর",
          "Keshabpur / কেশবপুর",
          "Abhaynagar / অভয়নগর",
          "Bagherpara / বাঘারপাড়া",
          "Chaugachha / চৌগাছা"
        ]
      },
      {
        name: "Satkhira / সাতক্ষীরা",
        thanas: [
          "Satkhira Sadar / সাতক্ষীরা সদর",
          "Assasuni / আশাশুনি",
          "Debhata / দেবহাটা",
          "Kalaroa / কলারোয়া",
          "Kaliganj / কালীগঞ্জ",
          "Shyamnagar / শ্যামনগর",
          "Tala / তালা"
        ]
      },
      {
        name: "Kushtia / কুষ্টিয়া",
        thanas: [
          "Kushtia Sadar / কুষ্টিয়া সদর",
          "Kumarkhali / কুমারখালী",
          "Daulatpur / দৌলতপুর",
          "Mirpur / মিরপুর",
          "Bheramara / ভেড়ামারা",
          "Khoksa / খোকসা"
        ]
      },
      {
        name: "Bagerhat / বাগেরহাট",
        thanas: [
          "Bagerhat Sadar / বাগেরহাট সদর",
          "Fakirhat / ফকিরহাট",
          "Mollahat / মোল্লাহাট",
          "Kachua / কচুয়া",
          "Rampal / রামপাল",
          "Mongla / মোংলা",
          "Morrelganj / মোরেলগঞ্জ",
          "Sarankhola / শরণখোলা",
          "Chitalmari / চিতলমারী"
        ]
      },
      {
        name: "Jhenaidah / ঝিনাইদহ",
        thanas: [
          "Jhenaidah Sadar / ঝিনাইদহ সদর",
          "Kaliganj / কালীগঞ্জ",
          "Kotchandpur / কোটচাঁদপুর",
          "Maheshpur / মহেশপুর",
          "Shailkupa / শৈলকুপা",
          "Harinakunda / হরিণাকুণ্ডু"
        ]
      },
      {
        name: "Chuadanga / চুয়াডাঙ্গা",
        thanas: [
          "Chuadanga Sadar / চুয়াডাঙ্গা সদর",
          "Alamdanga / আলমডাঙ্গা",
          "Damurhuda / দামুড়হুদা",
          "Jibannagar / জীবননগর"
        ]
      },
      {
        name: "Magura / মাগুরা",
        thanas: [
          "Magura Sadar / মাগুরা সদর",
          "Sreepur / শ্রীপুর",
          "Mohammadpur / মহম্মদপুর",
          "Shalikha / শালিখা"
        ]
      },
      {
        name: "Meherpur / মেহেরপুর",
        thanas: [
          "Meherpur Sadar / মেহেরপুর সদর",
          "Gangni / গাংনী",
          "Mujibnagar / মুজিবনগর"
        ]
      },
      {
        name: "Narail / নড়াইল",
        thanas: [
          "Narail Sadar / নড়াইল সদর",
          "Lohagara / লোহাগড়া",
          "Kalia / কালিয়া"
        ]
      }
    ]
  },
  {
    name: "Barishal / বরিশাল",
    districts: [
      {
        name: "Barishal / বরিশাল",
        thanas: [
          "Barishal Sadar / বরিশাল সদর",
          "Babuganj / বাবুগঞ্জ",
          "Bakerganj / বাকেরগঞ্জ",
          "Banaripara / বানারীপাড়া",
          "Gaurnadi / গৌরনদী",
          "Agailjhara / আগৈলঝাড়া",
          "Mehendiganj / মেহেন্দিগঞ্জ",
          "Muladi / মুলাদী",
          "Hizla / হিজলা",
          "Wazirpur / উজিরপুর"
        ]
      },
      {
        name: "Patuakhali / পটুয়াখালী",
        thanas: [
          "Patuakhali Sadar / পটুয়াখালী সদর",
          "Dumki / দুমকি",
          "Bauphal / বাউফল",
          "Dashmina / দশমিনা",
          "Galachipa / গলাচিপা",
          "Kalapara / কলাপাড়া",
          "Mirzaganj / মির্জাগঞ্জ",
          "Rangabali / রাঙ্গাবালী"
        ]
      },
      {
        name: "Bhola / ভোলা",
        thanas: [
          "Bhola Sadar / ভোলা সদর",
          "Borhanuddin / বোরহানউদ্দিন",
          "Char Fasson / চরফ্যাশন",
          "Daulatkhan / দৌলতখান",
          "Lalmohan / লালমোহন",
          "Manpura / মনপুরা",
          "Tazumuddin / তজুমদ্দিন"
        ]
      },
      {
        name: "Pirojpur / পিরোজপুর",
        thanas: [
          "Pirojpur Sadar / পিরোজপুর সদর",
          "Bhandaria / ভাণ্ডারিয়া",
          "Kawkhali / কাউখালী",
          "Mathbaria / মঠবাড়িয়া",
          "Nazirpur / নাজিরপুর",
          "Nesarabad (Swarupkati) / নেছারাবাদ (স্বরূপকাঠি)",
          "Zianagar (Indurkani) / ইন্দুরকানী"
        ]
      },
      {
        name: "Barguna / বরগুনা",
        thanas: [
          "Barguna Sadar / বরগুনা সদর",
          "Amtali / আমতলী",
          "Bamna / বামনা",
          "Betagi / বেতাগী",
          "Patharghata / পাথরঘাটা",
          "Taltali / তালতলী"
        ]
      },
      {
        name: "Jhalokathi / ঝালকাঠি",
        thanas: [
          "Jhalokathi Sadar / ঝালকাঠি সদর",
          "Kathalia / কাঠালিয়া",
          "Nalchity / নলছিটি",
          "Rajapur / রাজাপুর"
        ]
      }
    ]
  },
  {
    name: "Sylhet / সিলেট",
    districts: [
      {
        name: "Sylhet / সিলেট",
        thanas: [
          "Sylhet Sadar / সিলেট সদর",
          "Beanibazar / বিয়ানীবাজার",
          "Golapganj / গোলাপগঞ্জ",
          "Companiganj / কোম্পানীগঞ্জ",
          "Fenchuganj / ফেঞ্চুগঞ্জ",
          "Balaganj / বালাগঞ্জ",
          "Biswanath / বিশ্বনাথ",
          "Gowainghat / গোয়াইনঘাট",
          "Jaintiapur / জৈন্তাপুর",
          "Kanaighat / কানাইঘাট",
          "Zakiganj / জকিগঞ্জ",
          "South Surma / দক্ষিণ সুরমা",
          "Osmani Nagar / ওসমানীনগর"
        ]
      },
      {
        name: "Moulvibazar / মৌলভীবাজার",
        thanas: [
          "Moulvibazar Sadar / মৌলভীবাজার সদর",
          "Sreemangal / শ্রীমঙ্গল",
          "Kamalganj / কমলগঞ্জ",
          "Kulaura / কুলাউড়া",
          "Barlekha / বড়লেখা",
          "Juri / জুড়ী",
          "Rajnagar / রাজনগর"
        ]
      },
      {
        name: "Habiganj / হবিগঞ্জ",
        thanas: [
          "Habiganj Sadar / হবিগঞ্জ সদর",
          "Nabiganj / নবীগঞ্জ",
          "Bahubal / বাহুবল",
          "Madhabpur / মাধবপুর",
          "Chunarughat / চুনারুঘাট",
          "Lakhai / লাখাই",
          "Baniachong / বানিয়াচং",
          "Ajmiriganj / আজমিরীগঞ্জ",
          "Shayestaganj / শায়েস্তাগঞ্জ"
        ]
      },
      {
        name: "Sunamganj / সুনামগঞ্জ",
        thanas: [
          "Sunamganj Sadar / সুনামগঞ্জ সদর",
          "Chhatak / ছাতক",
          "Jagannathpur / জগন্নাথপুর",
          "Dowarabazar / দোয়ারাবাজার",
          "Tahirpur / তাহিরপুর",
          "Dharampasha / ধর্মপাশা",
          "Jamalganj / জামালগঞ্জ",
          "Shantiganj / শান্তিগঞ্জ",
          "Derai / দিরাই",
          "Sullah / শাল্লা",
          "Bishwamvarpur / বিশ্বম্ভরপুর",
          "Madhyanagar / মধ্যনগর"
        ]
      }
    ]
  },
  {
    name: "Rangpur / রংপুর",
    districts: [
      {
        name: "Rangpur / রংপুর",
        thanas: [
          "Rangpur Sadar / রংপুর সদর",
          "Kotwali / কোতোয়ালী",
          "Badarganj / বদরগঞ্জ",
          "Gangachhara / গংগাচড়া",
          "Kaunia / কাউনিয়া",
          "Mithapukur / মিঠাপুকুর",
          "Pirgachha / পীরগাছা",
          "Pirganj / পীরগঞ্জ",
          "Taraganj / তারাগঞ্জ"
        ]
      },
      {
        name: "Dinajpur / দিনাজপুর",
        thanas: [
          "Dinajpur Sadar / দিনাজপুর সদর",
          "Birganj / বীরগঞ্জ",
          "Biral / বোচাগঞ্জ",
          "Birol / বিরল",
          "Chirirbandar / চিরিরবন্দর",
          "Phulbari / ফুলবাড়ী",
          "Parbatipur / পার্বতীপুর",
          "Kaharole / কাহারোল",
          "Hakimpur / হাকিমপুর",
          "Ghoraghat / ঘোড়াঘাট",
          "Nawabganj / নবাবগঞ্জ",
          "Khansama / খানসামা"
        ]
      },
      {
        name: "Kurigram / কুড়িগ্রাম",
        thanas: [
          "Kurigram Sadar / কুড়িগ্রাম সদর",
          "Nageshwari / নাগেশ্বরী",
          "Bhurungamari / ভূরুঙ্গামারী",
          "Phulbari / ফুলবাড়ী",
          "Rajarhat / রাজারহাট",
          "Ulipur / উলিপুর",
          "Chilmari / চিলমারী",
          "Rowmari / রৌমারী",
          "Char Rajibpur / চর রাজিবপুর"
        ]
      },
      {
        name: "Gaibandha / গাইবান্ধা",
        thanas: [
          "Gaibandha Sadar / গাইবান্ধা সদর",
          "Gobindaganj / গোবিন্দগঞ্জ",
          "Palashbari / পলাশবাড়ী",
          "Sadullapur / সাদুল্লাপুর",
          "Sundarganj / সুন্দরগঞ্জ",
          "Saghata / সাঘাটা",
          "Phulchhari / ফুলছড়ি"
        ]
      },
      {
        name: "Nilphamari / নীলফামারী",
        thanas: [
          "Nilphamari Sadar / নীলফামারী সদর",
          "Saidpur / সৈয়দপুর",
          "Jaldhaka / জলঢাকা",
          "Kishoreganj / কিশোরগঞ্জ",
          "Domar / ডোমার",
          "Dimla / ডিমলা"
        ]
      },
      {
        name: "Thakurgaon / ঠাকুরগাঁও",
        thanas: [
          "Thakurgaon Sadar / ঠাকুরগাঁও সদর",
          "Pirganj / পীরগঞ্জ",
          "Baliadangi / বালিয়াডাঙ্গী",
          "Ranisankail / রানীশংকৈল",
          "Haripur / হরিপুর"
        ]
      },
      {
        name: "Panchagarh / পঞ্চগড়",
        thanas: [
          "Panchagarh Sadar / পঞ্চগড় সদর",
          "Debiganj / দেবীগঞ্জ",
          "Boda / বোদা",
          "Atwari / আটোয়ারী",
          "Tetulia / তেঁতুলিয়া"
        ]
      },
      {
        name: "Lalmonirhat / লালমনিরহাট",
        thanas: [
          "Lalmonirhat Sadar / লালমনিরহাট সদর",
          "Aditmari / আদিতমারী",
          "Kaliganj / কালীগঞ্জ",
          "Hatibandha / হাতীবান্ধা",
          "Patgram / পাটগ্রাম"
        ]
      }
    ]
  },
  {
    name: "Mymensingh / ময়মনসিংহ",
    districts: [
      {
        name: "Mymensingh / ময়মনসিংহ",
        thanas: [
          "Mymensingh Sadar / ময়মনসিংহ সদর",
          "Muktagachha / মুক্তাগাছা",
          "Trishal / ত্রিশাল",
          "Bhaluka / ভালুকা",
          "Gafargaon / গফরগাঁও",
          "Fulbaria / ফুলবাড়ীয়া",
          "Ishwarganj / ঈশ্বরগঞ্জ",
          "Nandail / নান্দাইল",
          "Gouripur / গৌরীপুর",
          "Haluaghat / হালুয়াঘাট",
          "Dhobaura / ধোবাউড়া",
          "Phulpur / ফুলপুর",
          "Tara Khanda / তারাকান্দা"
        ]
      },
      {
        name: "Jamalpur / জামালপুর",
        thanas: [
          "Jamalpur Sadar / জামালপুর সদর",
          "Melandaha / মেলান্দহ",
          "Madarganj / মাদারগঞ্জ",
          "Islampur / ইসলামপুর",
          "Dewanganj / দেওয়ানগঞ্জ",
          "Sarishabari / সরিষাবাড়ী",
          "Baksiganj / বকশীগঞ্জ"
        ]
      },
      {
        name: "Netrokona / নেত্রকোণা",
        thanas: [
          "Netrokona Sadar / নেত্রকোণা সদর",
          "Kendua / কেন্দুয়া",
          "Atpara / আটপাড়া",
          "Madan / মদন",
          "Khaliajuri / খালিয়াজুরী",
          "Durgapur / দুর্গাপুর",
          "Kalmakanda / কলমাকান্দা",
          "Barhatta / বারহাট্টা",
          "Purbadhala / পূর্বধলা",
          "Mohanganj / মোহনগঞ্জ"
        ]
      },
      {
        name: "Sherpur / শেরপুর",
        thanas: [
          "Sherpur Sadar / শেরপুর সদর",
          "Nakla / নকলা",
          "Nalitabari / নালিতাবাড়ী",
          "Sreebardi / শ্রীবরদী",
          "Jhenaigati / ঝিনাইগাতী"
        ]
      }
    ]
  }
];
