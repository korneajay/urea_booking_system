import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import './Dashboard.css';

const localT = {
  en: {
    dashboard: 'Dashboard',
    farmerDashboard: 'Farmer Dashboard',
    dealerDashboard: 'Dealer Dashboard',
    adminDashboard: 'Government Admin Control Panel',
    profileDetails: 'Profile Details',
    name: 'Name',
    phone: 'Phone Number',
    landSize: 'Land Size (Acres)',
    cropType: 'Crop Type',
    location: 'Location',
    ureaQuota: 'Urea Quota (2 bags/acre)',
    requestUrea: 'Request Urea Bags',
    bagsQuantity: 'Bags Quantity',
    selectDealer: 'Select Nearby Dealer',
    submitRequest: 'Submit Request',
    myBookings: 'My Bookings History',
    noBookings: 'No bookings found.',
    dealerStock: 'Dealer Stock',
    bagsAvailable: 'bags available',
    shopId: 'Shop ID',
    license: 'License Number',
    currentStock: 'Current Stock',
    addStock: 'Add Bags to Stock',
    addStockBtn: 'Add Stock',
    farmerRequests: 'Farmer Urea Requests',
    noRequests: 'No requests received.',
    verifyCollection: 'Verify & Deliver Urea (Collection OTP/Token)',
    enterToken: 'Enter Collection Token',
    deliverBtn: 'Deliver Bags',
    tokenPlaceholder: 'e.g. A1B2C3D4',
    adminFarmers: 'Manage Farmers',
    adminDealers: 'Manage Dealers',
    adminBookings: 'Manage Bookings',
    blockBtn: 'Block',
    unblockBtn: 'Unblock',
    deleteBtn: 'Delete',
    editBtn: 'Edit',
    saveBtn: 'Save',
    cancelBtn: 'Cancel',
    status: 'Status',
    token: 'Collection Token',
    actions: 'Actions',
    close: 'Close',
    successMsg: 'Operation completed successfully!',
    errorMsg: 'An error occurred. Please try again.',
    loading: 'Loading dashboard details...',
    logout: 'Log Out',
    dealer: 'Dealer',
    farmer: 'Farmer',
    priority: 'Priority',
    category: 'Category'
  },
  hi: {
    dashboard: 'डैशबोर्ड',
    farmerDashboard: 'किसान डैशबोर्ड',
    dealerDashboard: 'डीलर डैशबोर्ड',
    adminDashboard: 'सरकारी व्यवस्थापक नियंत्रण कक्ष',
    profileDetails: 'प्रोफ़ाइल विवरण',
    name: 'नाम',
    phone: 'मोबाइल नंबर',
    landSize: 'भूमि आकार (एकड़)',
    cropType: 'फसल का प्रकार',
    location: 'स्थान',
    ureaQuota: 'यूरिया कोटा (2 बोरी/एकड़)',
    requestUrea: 'यूरिया बोरी का अनुरोध करें',
    bagsQuantity: 'बोरी की मात्रा',
    selectDealer: 'नजदीकी डीलर चुनें',
    submitRequest: 'अनुरोध भेजें',
    myBookings: 'मेरा बुकिंग इतिहास',
    noBookings: 'कोई बुकिंग नहीं मिली।',
    dealerStock: 'डीलर स्टॉक',
    bagsAvailable: 'बोरी उपलब्ध',
    shopId: 'दुकान आईडी',
    license: 'लाइसेंस नंबर',
    currentStock: 'वर्तमान स्टॉक',
    addStock: 'स्टॉक में बोरी जोड़ें',
    addStockBtn: 'स्टॉक जोड़ें',
    farmerRequests: 'किसान यूरिया अनुरोध',
    noRequests: 'कोई अनुरोध प्राप्त नहीं हुआ।',
    verifyCollection: 'यूरिया वितरण सत्यापित करें (संग्रह टोकन)',
    enterToken: 'संग्रह टोकन दर्ज करें',
    deliverBtn: 'बोरी वितरित करें',
    tokenPlaceholder: 'जैसे A1B2C3D4',
    adminFarmers: 'किसानों का प्रबंधन',
    adminDealers: 'डीलरों का प्रबंधन',
    adminBookings: 'बुकिंग का प्रबंधन',
    blockBtn: 'ब्लॉक करें',
    unblockBtn: 'अनब्लॉक करें',
    deleteBtn: 'हटाएं',
    editBtn: 'संपादित करें',
    saveBtn: 'सहेजें',
    cancelBtn: 'रद्द करें',
    status: 'स्थिति',
    token: 'संग्रह टोकन',
    actions: 'कार्रवाई',
    close: 'बंद करें',
    successMsg: 'ऑपरेशन सफलतापूर्वक पूरा हुआ!',
    errorMsg: 'त्रुटि हुई। कृपया पुनः प्रयास करें।',
    loading: 'डैशबोर्ड लोड हो रहा है...',
    logout: 'लॉगआउट',
    dealer: 'डीलर',
    farmer: 'किसान',
    priority: 'प्राथमिकता',
    category: 'श्रेणी'
  },
  te: {
    dashboard: 'డాష్‌బోర్డ్',
    farmerDashboard: 'రైతు డాష్‌బోర్డ్',
    dealerDashboard: 'డీలర్ డాష్‌బోర్డ్',
    adminDashboard: 'ప్రభుత్వ అధికారి నియంత్రణ ప్యానెల్',
    profileDetails: 'ప్రొఫైల్ వివరాలు',
    name: 'పేరు',
    phone: 'ఫోన్ నంబర్',
    landSize: 'భూమి పరిమాణం (ఎకరాలు)',
    cropType: 'పంట రకం',
    location: 'చిరునామా',
    ureaQuota: 'యూరియా కోటా (ఎకరానికి 2 బస్తాలు)',
    requestUrea: 'యూరియా బస్తాల కొరకు అభ్యర్థన',
    bagsQuantity: 'బస్తాల సంఖ్య',
    selectDealer: 'సమీప డీలర్‌ను ఎంచుకోండి',
    submitRequest: 'అభ్యర్థన పంపండి',
    myBookings: 'నా బుకింగ్ చరిత్ర',
    noBookings: 'బుకింగ్స్ ఏవీ లేవు.',
    dealerStock: 'డీలర్ స్టాక్',
    bagsAvailable: 'బస్తాలు అందుబాటులో ఉన్నాయి',
    shopId: 'షాప్ ఐడి',
    license: 'లైసెన్స్ నంబర్',
    currentStock: 'ప్రస్తుత స్టाక్',
    addStock: 'స్టాక్‌కు బస్తాలను జోడించండి',
    addStockBtn: 'స్టాక్ జోడించు',
    farmerRequests: 'రైతుల యూరియా అభ్యర్థనలు',
    noRequests: 'అభ్యర్థనలు ఏవీ రాలేదు.',
    verifyCollection: 'యూరియా పంపిణీ ధృవీకరణ (కలెక్షన్ టోకెన్)',
    enterToken: 'టోకెన్ నమోదు చేయండి',
    deliverBtn: 'బస్తాలను అందజేయి',
    tokenPlaceholder: 'ఉదా: A1B2C3D4',
    adminFarmers: 'రైతుల నిర్వహణ',
    adminDealers: 'డీలర్ల నిర్వహण',
    adminBookings: 'బుకింగ్‌ల నిర్వహణ',
    blockBtn: 'బ్లాక్ చేయి',
    unblockBtn: 'అన్‌బ్లాక్ చేయి',
    deleteBtn: 'తొలగించు',
    editBtn: 'సవరించు',
    saveBtn: 'సేవ్ చేయి',
    cancelBtn: 'రద్దు చేయి',
    status: 'స్థితి',
    token: 'కలెక్షన్ టోకెన్',
    actions: 'చర్యలు',
    close: 'మూసివేయి',
    successMsg: 'చర్య విజయవంతమైంది!',
    errorMsg: 'లోపం సంభవించింది. మళ్లీ ప్రయత్నించండి.',
    loading: 'డాష్‌బోర్డ్ లోడ్ అవుతోంది...',
    logout: 'లాగౌట్',
    dealer: 'డీలర్',
    farmer: 'రైతు',
    priority: 'ప్రాధాನ್ಯత',
    category: 'వర్గం'
  },
  ta: {
    dashboard: 'டாஷ்போர்டு',
    farmerDashboard: 'விவசாயி டாஷ்போர்டு',
    dealerDashboard: 'டீலர் டாஷ்போர்டு',
    adminDashboard: 'அரசு நிர்வாகி கட்டுப்பாட்டு குழு',
    profileDetails: 'விவரங்கள்',
    name: 'பெயர்',
    phone: 'கைபேசி எண்',
    landSize: 'நில அளவு (ஏக்கர்)',
    cropType: 'பயிர் வகை',
    location: 'இருப்பிடம்',
    ureaQuota: 'யூரியா ஒதுக்கீடு (ஏக்கருக்கு 2 மூட்டைகள்)',
    requestUrea: 'யூரியா மூட்டைக்கு விண்ணப்பித்தல்',
    bagsQuantity: 'மூட்டைகளின் எண்ணிக்கை',
    selectDealer: 'அருகிலுள்ள டீலரைத் தேர்ந்தெடுக்கவும்',
    submitRequest: 'விண்ணப்பத்தை சமர்ப்பி',
    myBookings: 'எனது முன்பதிவு வரலாறு',
    noBookings: 'முன்பதிவுகள் ஏதுமில்லை.',
    dealerStock: 'இருப்பு விபரம்',
    bagsAvailable: 'மூட்டைகள் உள்ளன',
    shopId: 'கடை ஐடி',
    license: 'உரிம எண்',
    currentStock: 'தற்போதைய இருப்பு',
    addStock: 'இருப்பில் மூட்டைகளைச் சேர்',
    addStockBtn: 'சேர்',
    farmerRequests: 'விவசாயிகளின் யூரியா விண்ணப்பங்கள்',
    noRequests: 'விண்ணப்பங்கள் ஏதுமில்லை.',
    verifyCollection: 'விநியோகத்தை சரிபார் (டோக்கன்)',
    enterToken: 'டோக்கனை உள்ளிடவும்',
    deliverBtn: 'விநியோகம் செய்',
    tokenPlaceholder: 'எ.கா. A1B2C3D4',
    adminFarmers: 'விவசாயிகள் மேலாண்மை',
    adminDealers: 'டீலர்கள் மேலாண்மை',
    adminBookings: 'முன்பதிவுகள் மேலாண்மை',
    blockBtn: 'முடக்கு',
    unblockBtn: 'அனுமதி',
    deleteBtn: 'நீக்கு',
    editBtn: 'தொகு',
    saveBtn: 'சேமி',
    cancelBtn: 'ரத்து செய்',
    status: 'நிலை',
    token: 'டோக்கன்',
    actions: 'செயல்கள்',
    close: 'மூடு',
    successMsg: 'செயல் முடிந்தது!',
    errorMsg: 'பிழை ஏற்பட்டது. மீண்டும் முயலவும்.',
    loading: 'டாஷ்போர்டு ஏற்றப்படுகிறது...',
    logout: 'வெளியேறு',
    dealer: 'டீலர்',
    farmer: 'விவசாயி',
    priority: 'முன்னுரிமை',
    category: 'வகை'
  },
  kn: {
    dashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    farmerDashboard: 'ರೈತ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    dealerDashboard: 'ಡೀಲರ್ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    adminDashboard: 'ಸರ್ಕಾರಿ ನಿರ್ವಾಹಕರ ನಿಯಂತ್ರಣ ಫಲಕ',
    profileDetails: 'ಪ್ರೊಫೈಲ್ ವಿವರಗಳು',
    name: 'ಹೆಸರು',
    phone: 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ',
    landSize: 'ಭೂಮಿ ಗಾತ್ರ (ಎಕರೆ)',
    cropType: 'ಬೆಳೆ ಪ್ರಕಾರ',
    location: 'ಸ್ಥಳ',
    ureaQuota: 'ಯೂರಿಯಾ ಕೋಟಾ (ಎಕರೆಗೆ 2 ಚೀಲಗಳು)',
    requestUrea: 'ಯೂರಿಯಾ ಚೀಲಗಳಿಗಾಗಿ ವಿನಂತಿ',
    bagsQuantity: 'ಚೀಲಗಳ ಪ್ರಮಾಣ',
    selectDealer: 'ಹತ್ತಿರದ ಡೀಲರ್ ಆಯ್ಕೆ ಮಾಡಿ',
    submitRequest: 'ವಿನಂತಿ ಸಲ್ಲಿಸಿ',
    myBookings: 'ನನ್ನ ಬುಕಿಂಗ್ ಇತಿಹಾಸ',
    noBookings: 'ಯಾವುದೇ ಬುಕಿಂಗ್ ಕಂಡುಬಂದಿಲ್ಲ.',
    dealerStock: 'ಡೀಲರ್ ದಾಸ್ತಾನು',
    bagsAvailable: 'ಚೀಲಗಳು ಲಭ್ಯವಿವೆ',
    shopId: 'ಅಂಗಡಿ ಐಡಿ',
    license: 'ಲೈಸೆನ್ಸ್ ಸಂಖ್ಯೆ',
    currentStock: 'ಪ್ರಸ್ತುತ ದಾಸ್ತಾನು',
    addStock: 'ದಾಸ್ತಾನಿಗೆ ಚೀಲಗಳನ್ನು ಸೇರಿಸಿ',
    addStockBtn: 'ದಾಸ್ತಾನು ಸೇರಿಸಿ',
    farmerRequests: 'ರೈತರ ಯೂರಿಯಾ ವಿನಂತಿಗಳು',
    noRequests: 'ಯಾವುದೇ ವಿನಂತಿಗಳು ಬಂದಿಲ್ಲ.',
    verifyCollection: 'ಯೂರಿಯಾ ವಿತರಣೆ ಪರಿಶೀಲಿಸಿ (ಸಂಗ್ರಹ ಟೋಕನ್)',
    enterToken: 'ಟೋಕೆನ್ ನಮೂದಿಸಿ',
    deliverBtn: 'ಚೀಲಗಳನ್ನು ವಿತರಿಸಿ',
    tokenPlaceholder: 'ಉದಾ: A1B2C3D4',
    adminFarmers: 'ರೈತರ ನಿರ್ವಹಣೆ',
    adminDealers: 'ಡೀಲರ್‌ಗಳ ನಿರ್ವಹಣೆ',
    adminBookings: 'ಬುಕಿಂಗ್‌ಗಳ ನಿರ್ವಹಣೆ',
    blockBtn: 'ಬ್ಲಾಕ್ ಮಾಡಿ',
    unblockBtn: 'ಅನ್‌ಬ್ಲಾಕ್ ಮಾಡಿ',
    deleteBtn: 'ಅಳಿಸಿ',
    editBtn: 'ತಿದ್ದುಪಡಿ',
    saveBtn: 'ಉಳಿಸಿ',
    cancelBtn: 'ರದ್ದುಮಾಡಿ',
    status: 'ಸ್ಥಿತಿ',
    token: 'ಸಂಗ್ರಹ ಟೋಕನ್',
    actions: 'ಕ್ರಮಗಳು',
    close: 'ಮುಚ್ಚಿ',
    successMsg: 'ಕಾರ್ಯಾಚರಣೆ ಯಶಸ್ವಿಯಾಗಿದೆ!',
    errorMsg: 'ದೋಷ ಸಂಭವಿಸಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೊಮ್ಮೆ ಪ್ರಯತ್ನಿಸಿ.',
    loading: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ಲೋಡ್ ಆಗುತ್ತಿದೆ...',
    logout: 'ಲಾಗ್ ಔಟ್',
    dealer: 'ಡೀಲರ್',
    farmer: 'ರೈತ',
    priority: 'ಆದ್ಯತೆ',
    category: 'ವರ್ಗ'
  },
  mr: {
    dashboard: 'डॅशबोर्ड',
    farmerDashboard: 'शेतकरी डॅशबोर्ड',
    dealerDashboard: 'डीलर डॅशबोर्ड',
    adminDashboard: 'सरकारी प्रशासक नियंत्रण पॅनेल',
    profileDetails: 'प्रोफाइल तपशील',
    name: 'नाव',
    phone: 'मोबाईल नंबर',
    landSize: 'जमीन आकार (एकर)',
    cropType: 'पिकाचा प्रकार',
    location: 'पत्ता',
    ureaQuota: 'युरिया कोटा (२ पोते/एकर)',
    requestUrea: 'युरिया पोत्यांची मागणी करा',
    bagsQuantity: 'पोत्यांची संख्या',
    selectDealer: 'जवळचा डीलर निवडा',
    submitRequest: 'मागणी पाठवा',
    myBookings: 'माझा बुकिंग इतिहास',
    noBookings: 'कोणतेही बुकिंग आढळले नाही.',
    dealerStock: 'डीलर साठा',
    bagsAvailable: 'पोते उपलब्ध',
    shopId: 'दुकान आयडी',
    license: 'परवाना क्रमांक',
    currentStock: 'सध्याचा साठा',
    addStock: 'साठ्यात पोते जोडा',
    addStockBtn: 'साठा जोडा',
    farmerRequests: 'शेतकऱ्यांचे युरिया विनंत्या',
    noRequests: 'कोणतीही विनंती प्राप्त झाली नाही.',
    verifyCollection: 'युरिया वितरण पडताळणी (टोकन)',
    enterToken: 'टोकन प्रविष्ट करा',
    deliverBtn: 'पोते वितरीत करा',
    tokenPlaceholder: 'उदा: A1B2C3D4',
    adminFarmers: 'शेतकरी व्यवस्थापन',
    adminDealers: 'डीलर व्यवस्थापन',
    adminBookings: 'बुकिंग व्यवस्थापन',
    blockBtn: 'ब्लॉक करा',
    unblockBtn: 'अनब्लॉक करा',
    deleteBtn: 'हटवा',
    editBtn: 'संपादन',
    saveBtn: 'जतन करा',
    cancelBtn: 'रद्द करा',
    status: 'स्थिती',
    token: 'टोकन',
    actions: 'कृती',
    close: 'बंद करा',
    successMsg: 'क्रिया यशस्वी झाली!',
    errorMsg: 'त्रुटी आली. पुन्हा प्रयत्न करा.',
    loading: 'डॅशबोर्ड लोड होत आहे...',
    logout: 'लॉगआउट',
    dealer: 'डीलर',
    farmer: 'शेतकरी',
    priority: 'प्राधान्य',
    category: 'वर्ग'
  }
};

const Dashboard = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const t = (key) => {
    return localT[language]?.[key] || localT['en']?.[key] || key;
  };

  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Farmer specific states
  const [nearbyDealers, setNearbyDealers] = useState([]);
  const [selectedDealerId, setSelectedDealerId] = useState('');
  const [requestedBags, setRequestedBags] = useState('');
  const [farmerBookings, setFarmerBookings] = useState([]);

  // Dealer specific states
  const [stockInput, setStockInput] = useState('');
  const [dealerRequests, setDealerRequests] = useState([]);
  const [verifyTokenInput, setVerifyTokenInput] = useState('');

  // Admin specific states
  const [farmersList, setFarmersList] = useState([]);
  const [dealersList, setDealersList] = useState([]);
  const [bookingsList, setBookingsList] = useState([]);
  const [editingItem, setEditingItem] = useState(null); // { type: 'FARMER'|'DEALER', data: {} }

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      navigate('/login');
      return;
    }
    const user = JSON.parse(userStr);
    setCurrentUser(user);
    fetchDashboardData(user);
  }, []);

  const fetchDashboardData = async (user) => {
    setLoading(true);
    try {
      if (user.role === 'FARMER') {
        // Fetch nearby dealers
        const uDet = user.userDetails;
        const resDealers = await fetch(`http://localhost:8080/api/dealers/nearby?state=${encodeURIComponent(uDet.state)}&district=${encodeURIComponent(uDet.district)}`);
        if (resDealers.ok) {
          const dl = await resDealers.json();
          setNearbyDealers(dl);
          if (dl.length > 0) setSelectedDealerId(dl[0].id);
        }
        // Fetch bookings
        const resBookings = await fetch(`http://localhost:8080/api/bookings/farmer/${user.id}`);
        if (resBookings.ok) {
          setFarmerBookings(await resBookings.json());
        }
      } else if (user.role === 'DEALER') {
        // Fetch bookings/requests with farmer details
        const resReqs = await fetch(`http://localhost:8080/api/bookings/dealer/${user.id}/details`);
        if (resReqs.ok) {
          setDealerRequests(await resReqs.json());
        }
      } else if (user.role === 'ADMIN') {
        // Fetch all farmers, dealers, bookings
        const [fRes, dRes, bRes] = await Promise.all([
          fetch('http://localhost:8080/api/farmers'),
          fetch('http://localhost:8080/api/dealers'),
          fetch('http://localhost:8080/api/bookings')
        ]);
        if (fRes.ok) setFarmersList(await fRes.json());
        if (dRes.ok) setDealersList(await dRes.json());
        if (bRes.ok) setBookingsList(await bRes.json());
      }
    } catch (err) {
      console.error(err);
      setError(t('errorMsg'));
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  // Farmer Actions
  const handleCreateBooking = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    const qty = parseFloat(requestedBags);
    const limit = currentUser.userDetails.landSize * 2;
    const alreadyBooked = farmerBookings
      .filter(b => b.status !== 'REJECTED')
      .reduce((sum, b) => sum + b.quantity, 0);
    const remainingQuota = Math.max(0, limit - alreadyBooked);

    if (qty > remainingQuota) {
      setError(`Max bags exceeded! You have already booked ${alreadyBooked} / ${limit} bags. Remaining quota: ${remainingQuota} bags.`);
      return;
    }
    if (qty <= 0 || isNaN(qty)) {
      setError('Please enter a valid quantity of bags.');
      return;
    }
    if (!selectedDealerId) {
      setError('Please select a dealer.');
      return;
    }

    try {
      const res = await fetch(`http://localhost:8080/api/bookings?farmerId=${currentUser.id}&dealerId=${selectedDealerId}&quantity=${qty}`, {
        method: 'POST'
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to submit booking');
      }
      setSuccess('Booking request submitted successfully!');
      setRequestedBags('');
      // refresh bookings
      const resBookings = await fetch(`http://localhost:8080/api/bookings/farmer/${currentUser.id}`);
      if (resBookings.ok) {
        setFarmerBookings(await resBookings.json());
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Dealer Actions
  const handleAddStock = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    const qty = parseFloat(stockInput);
    if (qty <= 0 || isNaN(qty)) {
      setError('Please enter a valid stock quantity.');
      return;
    }

    try {
      const res = await fetch(`http://localhost:8080/api/dealers/${currentUser.id}/stock?quantity=${qty}&type=RECEIVED`, {
        method: 'POST'
      });
      if (!res.ok) throw new Error('Failed to add stock');
      const updatedDealer = await res.json();
      
      // Update local storage user details
      const updatedUser = { ...currentUser, userDetails: updatedDealer };
      setCurrentUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));

      setSuccess(`Successfully added ${qty} bags to stock!`);
      setStockInput('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    setSuccess('');
    setError('');
    try {
      const res = await fetch(`http://localhost:8080/api/bookings/${bookingId}/status?status=${newStatus}`, {
        method: 'PATCH'
      });
      if (!res.ok) throw new Error('Failed to update status');
      setSuccess(`Booking status updated to ${newStatus}`);
      
      // refresh dealer requests
      const resReqs = await fetch(`http://localhost:8080/api/bookings/dealer/${currentUser.id}/details`);
      if (resReqs.ok) {
        setDealerRequests(await resReqs.json());
      }
      // Refresh dealer stock as well (since accepting decreases stock)
      const resDealer = await fetch(`http://localhost:8080/api/dealers`);
      if (resDealer.ok) {
        const all = await resDealer.json();
        const me = all.find(d => d.id === currentUser.id);
        if (me) {
          const updatedUser = { ...currentUser, userDetails: me };
          setCurrentUser(updatedUser);
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleVerifyDeliver = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    if (!verifyTokenInput.trim()) {
      setError('Please enter a collection token.');
      return;
    }

    try {
      const res = await fetch(`http://localhost:8080/api/bookings/collect?token=${verifyTokenInput.trim()}&dealerId=${currentUser.id}`, {
        method: 'POST'
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Verification failed. Invalid token or dealer mismatch.');
      }
      setSuccess('Bags collected/delivered successfully!');
      setVerifyTokenInput('');
      
      // Refresh requests list
      const resReqs = await fetch(`http://localhost:8080/api/bookings/dealer/${currentUser.id}/details`);
      if (resReqs.ok) {
        setDealerRequests(await resReqs.json());
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Admin Actions
  const handleAdminDeleteFarmer = async (farmerId) => {
    if (!window.confirm('Are you sure you want to permanently delete this farmer account?')) return;
    try {
      const res = await fetch(`http://localhost:8080/api/farmers/${farmerId}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to delete farmer');
      setSuccess('Farmer deleted successfully');
      setFarmersList(farmersList.filter(f => f.id !== farmerId));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAdminBlockFarmer = async (farmerId, currentBlocked) => {
    try {
      const res = await fetch(`http://localhost:8080/api/farmers/${farmerId}/block?blocked=${!currentBlocked}`, {
        method: 'PATCH'
      });
      if (!res.ok) throw new Error('Failed to update block status');
      setSuccess(currentBlocked ? 'Farmer unblocked successfully' : 'Farmer blocked successfully');
      setFarmersList(farmersList.map(f => f.id === farmerId ? { ...f, blocked: !currentBlocked } : f));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAdminDeleteDealer = async (dealerId) => {
    if (!window.confirm('Are you sure you want to permanently delete this dealer account?')) return;
    try {
      const res = await fetch(`http://localhost:8080/api/dealers/${dealerId}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to delete dealer');
      setSuccess('Dealer deleted successfully');
      setDealersList(dealersList.filter(d => d.id !== dealerId));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAdminBlockDealer = async (dealerId, currentBlocked) => {
    try {
      const res = await fetch(`http://localhost:8080/api/dealers/${dealerId}/block?blocked=${!currentBlocked}`, {
        method: 'PATCH'
      });
      if (!res.ok) throw new Error('Failed to update block status');
      setSuccess(currentBlocked ? 'Dealer unblocked successfully' : 'Dealer blocked successfully');
      setDealersList(dealersList.map(d => d.id === dealerId ? { ...d, blocked: !currentBlocked } : d));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAdminDeleteBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) return;
    try {
      const res = await fetch(`http://localhost:8080/api/bookings/${bookingId}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to delete booking');
      setSuccess('Booking deleted successfully');
      setBookingsList(bookingsList.filter(b => b.id !== bookingId));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAdminSaveEdit = async (e) => {
    e.preventDefault();
    const { type, data } = editingItem;
    const url = type === 'FARMER' ? `http://localhost:8080/api/farmers/${data.id}` : `http://localhost:8080/api/dealers/${data.id}`;
    
    try {
      const res = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to save updates');
      setSuccess('Profile updated successfully');
      setEditingItem(null);
      fetchDashboardData(currentUser);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container loading-container">
        <div className="spinner"></div>
        <p>{t('loading')}</p>
      </div>
    );
  }

  const uDet = currentUser?.userDetails || {};

  return (
    <div className="dashboard-container">
      {/* Dashboard Top Navigation */}
      <div className="dashboard-header">
        <div className="brand-section">
          <h2>KISAN UREA</h2>
          <span className="badge role-badge">{currentUser?.role}</span>
        </div>
        <div className="user-welcome">
          <span>{t('dashboardWelcome')} <strong>{currentUser?.name}</strong></span>
        </div>
      </div>

      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {/* FARMER DASHBOARD */}
      {currentUser?.role === 'FARMER' && (
        <div className="dashboard-grid">
          {/* Left: Profile & Form */}
          <div className="dashboard-card border-glow">
            <h3>{t('profileDetails')}</h3>
            <div className="profile-grid">
              <div className="profile-item"><strong>{t('name')}:</strong> {uDet.name}</div>
              <div className="profile-item"><strong>{t('phone')}:</strong> {uDet.phone}</div>
              <div className="profile-item"><strong>{t('landSize')}:</strong> {uDet.landSize}</div>
              <div className="profile-item"><strong>{t('cropType')}:</strong> {uDet.cropType}</div>
              <div className="profile-item"><strong>{t('ureaQuota')}:</strong> {uDet.ureaQuota} {t('bags')}</div>
              <div className="profile-item">
                <strong>Remaining Quota:</strong> {
                  (() => {
                    const limit = uDet.ureaQuota || 0;
                    const alreadyBooked = farmerBookings
                      .filter(b => b.status !== 'REJECTED')
                      .reduce((sum, b) => sum + b.quantity, 0);
                    return Math.max(0, limit - alreadyBooked);
                  })()
                } {t('bags')}
              </div>
              <div className="profile-item"><strong>{t('location')}:</strong> {uDet.village}, {uDet.district}, {uDet.state}</div>
              <div className="profile-item"><strong>{t('priority')}:</strong> <span className={`priority-badge ${uDet.priority?.toLowerCase()}`}>{uDet.priority}</span></div>
            </div>

            <hr className="divider" />

            <h3>{t('requestUrea')}</h3>
            <form onSubmit={handleCreateBooking} className="request-form">
              <div className="form-group">
                <label>{t('bagsQuantity')}</label>
                <input
                  type="number"
                  placeholder={`Max ${uDet.landSize * 2} bags`}
                  value={requestedBags}
                  onChange={(e) => setRequestedBags(e.target.value)}
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group">
                <label>{t('selectDealer')}</label>
                <select
                  value={selectedDealerId}
                  onChange={(e) => setSelectedDealerId(e.target.value)}
                  className="form-control"
                  required
                >
                  {nearbyDealers.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.shopId}) - {d.currentStock} bags available ({[d.village, d.mandal, d.district].filter(Boolean).join(', ')})
                    </option>
                  ))}
                  {nearbyDealers.length === 0 && (
                    <option value="">No dealers in your district</option>
                  )}
                </select>
              </div>

              <button type="submit" className="btn btn-primary w-full">{t('submitRequest')}</button>
            </form>
          </div>

          {/* Right: Bookings History */}
          <div className="dashboard-card border-glow">
            <h3>{t('myBookings')}</h3>
            {farmerBookings.length === 0 ? (
              <p className="text-muted">{t('noBookings')}</p>
            ) : (
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Bags</th>
                      <th>{t('status')}</th>
                      <th>{t('token')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {farmerBookings.map((b) => (
                      <tr key={b.id}>
                        <td>{new Date(b.bookingDate).toLocaleDateString()}</td>
                        <td>{b.quantity}</td>
                        <td>
                          <span className={`status-badge ${b.status.toLowerCase()}`}>{b.status}</span>
                        </td>
                        <td>
                          {b.status === 'ACCEPTED' || b.status === 'COLLECTED' ? (
                            <code className="token-code">{b.token}</code>
                          ) : (
                            <span className="text-muted">Generated when accepted</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* DEALER DASHBOARD */}
      {currentUser?.role === 'DEALER' && (
        <div className="dashboard-grid">
          {/* Left: Profile & Inventory */}
          <div className="dashboard-card border-glow">
            <h3>{t('profileDetails')}</h3>
            <div className="profile-grid">
              <div className="profile-item"><strong>{t('name')}:</strong> {uDet.name}</div>
              <div className="profile-item"><strong>{t('shopId')}:</strong> {uDet.shopId}</div>
              <div className="profile-item"><strong>{t('license')}:</strong> {uDet.licenseNumber}</div>
              <div className="profile-item"><strong>{t('phone')}:</strong> {uDet.phone}</div>
              <div className="profile-item"><strong>{t('currentStock')}:</strong> <span className="stock-counter">{uDet.currentStock} {t('bags')}</span></div>
              <div className="profile-item"><strong>{t('location')}:</strong> {uDet.village}, {uDet.mandal}, {uDet.district}, {uDet.state}</div>
            </div>

            <hr className="divider" />

            <h3>{t('addStock')}</h3>
            <form onSubmit={handleAddStock} className="request-form">
              <div className="form-group">
                <label>Number of Bags</label>
                <input
                  type="number"
                  placeholder="e.g. 50"
                  value={stockInput}
                  onChange={(e) => setStockInput(e.target.value)}
                  className="form-control"
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary w-full">{t('addStockBtn')}</button>
            </form>

            <hr className="divider" />

            <h3>{t('verifyCollection')}</h3>
            <form onSubmit={handleVerifyDeliver} className="request-form">
              <div className="form-group">
                <label>{t('enterToken')}</label>
                <input
                  type="text"
                  placeholder={t('tokenPlaceholder')}
                  value={verifyTokenInput}
                  onChange={(e) => setVerifyTokenInput(e.target.value)}
                  className="form-control"
                  style={{ textTransform: 'uppercase' }}
                  required
                />
              </div>
              <button type="submit" className="btn btn-accent w-full">{t('deliverBtn')}</button>
            </form>
          </div>

          {/* Right: Farmer Requests */}
          <div className="dashboard-card border-glow">
            <h3>{t('farmerRequests')}</h3>
            {dealerRequests.length === 0 ? (
              <p className="text-muted">{t('noRequests')}</p>
            ) : (
              <div className="requests-list">
                {dealerRequests.map((item) => (
                  <div key={item.id} className="request-card">
                    <div className="request-card-header">
                      <div>
                        <h4>{item.farmerName}</h4>
                        <span className="text-muted">{item.farmerPhone}</span>
                      </div>
                      <span className={`status-badge ${item.status.toLowerCase()}`}>{item.status}</span>
                    </div>
                    <div className="request-card-body">
                      <div><strong>Land Size:</strong> {item.landSize} Acres</div>
                      <div><strong>Quota Limit:</strong> {item.eligibleBags} Bags</div>
                      <div><strong>Requested Bags:</strong> <span className="highlight">{item.quantity}</span></div>
                      <div><strong>Location:</strong> {item.village}, {item.district}</div>
                      {item.token && <div><strong>Token:</strong> <code className="token-code">{item.token}</code></div>}
                    </div>
                    {item.status === 'PENDING' && (
                      <div className="request-card-actions">
                        <button
                          onClick={() => handleUpdateBookingStatus(item.id, 'ACCEPTED')}
                          className="btn btn-success btn-sm"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleUpdateBookingStatus(item.id, 'REJECTED')}
                          className="btn btn-danger btn-sm"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* GOVERNMENT ADMIN CONTROL PANEL */}
      {currentUser?.role === 'ADMIN' && (
        <div className="admin-dashboard">
          {/* Farmers */}
          <div className="dashboard-card border-glow mb-8">
            <div className="card-header">
              <h3>{t('adminFarmers')}</h3>
            </div>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>{t('name')}</th>
                    <th>{t('phone')}</th>
                    <th>Land (Acres)</th>
                    <th>Crop</th>
                    <th>Quota</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>{t('actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {farmersList.map((f) => (
                    <tr key={f.id}>
                      <td>{f.name}</td>
                      <td>{f.phone}</td>
                      <td>{f.landSize}</td>
                      <td>{f.cropType}</td>
                      <td>{f.ureaQuota}</td>
                      <td><span className={`priority-badge ${f.priority?.toLowerCase()}`}>{f.priority}</span></td>
                      <td>
                        <span className={`status-badge ${f.blocked ? 'rejected' : 'accepted'}`}>
                          {f.blocked ? 'Blocked' : 'Active'}
                        </span>
                      </td>
                      <td className="actions-cell">
                        <button
                          onClick={() => setEditingItem({ type: 'FARMER', data: { ...f } })}
                          className="btn btn-secondary btn-xs"
                        >
                          {t('editBtn')}
                        </button>
                        <button
                          onClick={() => handleAdminBlockFarmer(f.id, f.blocked)}
                          className={`btn btn-xs ${f.blocked ? 'btn-success' : 'btn-warning'}`}
                        >
                          {f.blocked ? t('unblockBtn') : t('blockBtn')}
                        </button>
                        <button
                          onClick={() => handleAdminDeleteFarmer(f.id)}
                          className="btn btn-danger btn-xs"
                        >
                          {t('deleteBtn')}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Dealers */}
          <div className="dashboard-card border-glow mb-8">
            <div className="card-header">
              <h3>{t('adminDealers')}</h3>
            </div>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>{t('name')}</th>
                    <th>{t('shopId')}</th>
                    <th>{t('phone')}</th>
                    <th>License</th>
                    <th>Stock (Bags)</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>{t('actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {dealersList.map((d) => (
                    <tr key={d.id}>
                      <td>{d.name}</td>
                      <td>{d.shopId}</td>
                      <td>{d.phone}</td>
                      <td>{d.licenseNumber}</td>
                      <td>{d.currentStock}</td>
                      <td>{d.village}, {d.district}</td>
                      <td>
                        <span className={`status-badge ${d.blocked ? 'rejected' : 'accepted'}`}>
                          {d.blocked ? 'Blocked' : 'Active'}
                        </span>
                      </td>
                      <td className="actions-cell">
                        <button
                          onClick={() => setEditingItem({ type: 'DEALER', data: { ...d } })}
                          className="btn btn-secondary btn-xs"
                        >
                          {t('editBtn')}
                        </button>
                        <button
                          onClick={() => handleAdminBlockDealer(d.id, d.blocked)}
                          className={`btn btn-xs ${d.blocked ? 'btn-success' : 'btn-warning'}`}
                        >
                          {d.blocked ? t('unblockBtn') : t('blockBtn')}
                        </button>
                        <button
                          onClick={() => handleAdminDeleteDealer(d.id)}
                          className="btn btn-danger btn-xs"
                        >
                          {t('deleteBtn')}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bookings */}
          <div className="dashboard-card border-glow">
            <div className="card-header">
              <h3>{t('adminBookings')}</h3>
            </div>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Farmer ID</th>
                    <th>Dealer ID</th>
                    <th>Quantity (Bags)</th>
                    <th>{t('token')}</th>
                    <th>{t('status')}</th>
                    <th>Date</th>
                    <th>{t('actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {bookingsList.map((b) => (
                    <tr key={b.id}>
                      <td><code>{b.id?.substring(0, 8)}</code></td>
                      <td><code>{b.farmerId?.substring(0, 8)}</code></td>
                      <td><code>{b.dealerId?.substring(0, 8)}</code></td>
                      <td>{b.quantity}</td>
                      <td><code className="token-code">{b.token}</code></td>
                      <td>
                        <span className={`status-badge ${b.status?.toLowerCase()}`}>{b.status}</span>
                      </td>
                      <td>{new Date(b.bookingDate).toLocaleDateString()}</td>
                      <td>
                        <button
                          onClick={() => handleAdminDeleteBooking(b.id)}
                          className="btn btn-danger btn-xs"
                        >
                          {t('deleteBtn')}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL FOR ADMIN */}
      {editingItem && (
        <div className="modal-backdrop">
          <div className="modal-content border-glow">
            <h3>Edit {editingItem.type === 'FARMER' ? 'Farmer' : 'Dealer'}</h3>
            <form onSubmit={handleAdminSaveEdit}>
              {editingItem.type === 'FARMER' ? (
                <>
                  <div className="form-group">
                    <label>{t('name')}</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editingItem.data.name || ''}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        data: { ...editingItem.data, name: e.target.value }
                      })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>{t('phone')}</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editingItem.data.phone || ''}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        data: { ...editingItem.data, phone: e.target.value }
                      })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Land Size (Acres)</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-control"
                      value={editingItem.data.landSize || ''}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        data: { ...editingItem.data, landSize: parseFloat(e.target.value) }
                      })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Crop Type</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editingItem.data.cropType || ''}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        data: { ...editingItem.data, cropType: e.target.value }
                      })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>State</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editingItem.data.state || ''}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        data: { ...editingItem.data, state: e.target.value }
                      })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>District</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editingItem.data.district || ''}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        data: { ...editingItem.data, district: e.target.value }
                      })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Village</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editingItem.data.village || ''}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        data: { ...editingItem.data, village: e.target.value }
                      })}
                      required
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="form-group">
                    <label>{t('name')}</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editingItem.data.name || ''}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        data: { ...editingItem.data, name: e.target.value }
                      })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>{t('shopId')}</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editingItem.data.shopId || ''}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        data: { ...editingItem.data, shopId: e.target.value }
                      })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>{t('phone')}</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editingItem.data.phone || ''}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        data: { ...editingItem.data, phone: e.target.value }
                      })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>License Number</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editingItem.data.licenseNumber || ''}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        data: { ...editingItem.data, licenseNumber: e.target.value }
                      })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Current Stock (Bags)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={editingItem.data.currentStock || ''}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        data: { ...editingItem.data, currentStock: parseFloat(e.target.value) }
                      })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>State</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editingItem.data.state || ''}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        data: { ...editingItem.data, state: e.target.value }
                      })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>District</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editingItem.data.district || ''}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        data: { ...editingItem.data, district: e.target.value }
                      })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Village</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editingItem.data.village || ''}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        data: { ...editingItem.data, village: e.target.value }
                      })}
                      required
                    />
                  </div>
                </>
              )}
              <div className="modal-actions">
                <button type="submit" className="btn btn-primary">{t('saveBtn')}</button>
                <button type="button" className="btn btn-secondary" onClick={() => setEditingItem(null)}>{t('cancelBtn')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
