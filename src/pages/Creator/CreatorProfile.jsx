import { useState, useContext, useEffect } from 'react';
import useAuth from '../../hooks/useAuth.js';
import { creatorService } from '../../services/creatorService.js';
import { NotificationContext } from '../../context/NotificationContext.jsx';

const NICHES = [
  'lifestyle', 'tech', 'gaming', 'beauty', 'fashion', 'fitness', 'food & cooking',
  'travel', 'finance', 'education', 'music', 'comedy', 'vlogging', 'photography',
  'art & design', 'sports', 'coding', 'study with me', 'motivation', 'anime',
  'skincare', 'DIY & craft', 'dance', 'business', 'books', 'movies & series',
  'mental health', 'news & current affairs', 'sustainable living', 'pets', 'college', 'iit', 'jee', 'competetive exams'
];

const STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman & Nicobar', 'Chandigarh', 'D&NH and D&D', 'Delhi', 'J&K', 'Ladakh',
  'Lakshadweep', 'Puducherry'
];

const CITIES = {
  'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool', 'Tirupati', 'Rajahmundry', 'Kakinada', 'Kadapa', 'Anantapur', 'Eluru', 'Ongole', 'Vizianagaram', 'Chittoor', 'Srikakulam'],
  'Arunachal Pradesh': ['Itanagar', 'Tawang', 'Ziro', 'Pasighat', 'Bomdila', 'Naharlagun', 'Roing'],
  'Assam': ['Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat', 'Nagaon', 'Tinsukia', 'Tezpur', 'Bongaigaon', 'Dhubri', 'Goalpara', 'Karimganj'],
  'Bihar': ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Darbhanga', 'Arrah', 'Bihar Sharif', 'Begusarai', 'Katihar', 'Munger', 'Purnia', 'Hajipur', 'Saharsa', 'Chapra', 'Samastipur'],
  'Chhattisgarh': ['Raipur', 'Bhilai', 'Bilaspur', 'Korba', 'Raigarh', 'Durg', 'Jagdalpur', 'Rajnandgaon', 'Ambikapur'],
  'Goa': ['Panaji', 'Margao', 'Mapusa', 'Vasco da Gama', 'Ponda', 'Calangute', 'Madgaon'],
  'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar', 'Gandhinagar', 'Junagadh', 'Anand', 'Navsari', 'Morbi', 'Nadiad', 'Mehsana', 'Bharuch', 'Porbandar', 'Surendranagar'],
  'Haryana': ['Gurugram', 'Faridabad', 'Panipat', 'Ambala', 'Yamunanagar', 'Rohtak', 'Hisar', 'Karnal', 'Sonipat', 'Panchkula', 'Bhiwani', 'Sirsa', 'Rewari', 'Kaithal'],
  'Himachal Pradesh': ['Shimla', 'Manali', 'Dharamsala', 'Solan', 'Mandi', 'Kullu', 'Hamirpur', 'Baddi', 'Nahan', 'Bilaspur'],
  'Jharkhand': ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Deoghar', 'Hazaribagh', 'Giridih', 'Ramgarh', 'Phusro'],
  'Karnataka': ['Bengaluru', 'Mysuru', 'Hubballi', 'Mangaluru', 'Belagavi', 'Kalaburagi', 'Ballari', 'Vijayapura', 'Shivamogga', 'Tumakuru', 'Udupi', 'Raichur', 'Bidar', 'Dharwad', 'Davanagere'],
  'Kerala': ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Kollam', 'Palakkad', 'Alappuzha', 'Malappuram', 'Kannur', 'Kottayam', 'Kasaragod', 'Ernakulam'],
  'Madhya Pradesh': ['Bhopal', 'Indore', 'Gwalior', 'Jabalpur', 'Ujjain', 'Sagar', 'Dewas', 'Satna', 'Ratlam', 'Rewa', 'Singrauli', 'Burhanpur', 'Chhindwara', 'Guna'],
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik', 'Aurangabad', 'Solapur', 'Kalyan', 'Vasai-Virar', 'Amravati', 'Navi Mumbai', 'Kolhapur', 'Akola', 'Latur', 'Nanded', 'Sangli', 'Malegaon', 'Jalgaon', 'Dhule', 'Ahmednagar'],
  'Manipur': ['Imphal', 'Thoubal', 'Bishnupur', 'Churachandpur', 'Senapati'],
  'Meghalaya': ['Shillong', 'Tura', 'Nongstoin', 'Jowai', 'Baghmara'],
  'Mizoram': ['Aizawl', 'Lunglei', 'Champhai', 'Serchhip', 'Kolasib'],
  'Nagaland': ['Kohima', 'Dimapur', 'Mokokchung', 'Tuensang', 'Wokha', 'Zunheboto'],
  'Odisha': ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Berhampur', 'Sambalpur', 'Puri', 'Balasore', 'Bhadrak', 'Baripada', 'Jharsuguda', 'Paradip'],
  'Punjab': ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'Mohali', 'Hoshiarpur', 'Gurdaspur', 'Firozpur', 'Moga', 'Pathankot', 'Abohar', 'Phagwara'],
  'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Bikaner', 'Ajmer', 'Bhilwara', 'Alwar', 'Bharatpur', 'Sikar', 'Pali', 'Sri Ganganagar', 'Barmer', 'Chittorgarh', 'Nagaur'],
  'Sikkim': ['Gangtok', 'Namchi', 'Gyalshing', 'Mangan'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli', 'Tiruppur', 'Erode', 'Vellore', 'Thoothukudi', 'Dindigul', 'Thanjavur', 'Kanchipuram', 'Cuddalore', 'Hosur', 'Ambattur', 'Avadi'],
  'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Ramagundam', 'Mahbubnagar', 'Khammam', 'Nalgonda', 'Adilabad', 'Suryapet', 'Siddipet', 'Mancherial', 'Miryalaguda'],
  'Tripura': ['Agartala', 'Dharmanagar', 'Udaipur', 'Kailashahar', 'Belonia'],
  'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Agra', 'Varanasi', 'Prayagraj', 'Meerut', 'Bareilly', 'Aligarh', 'Moradabad', 'Saharanpur', 'Gorakhpur', 'Ghaziabad', 'Noida', 'Mathura', 'Jhansi', 'Muzaffarnagar', 'Firozabad', 'Rampur', 'Shahjahanpur', 'Hapur', 'Raebareli', 'Faizabad', 'Mirzapur'],
  'Uttarakhand': ['Dehradun', 'Haridwar', 'Roorkee', 'Haldwani', 'Kashipur', 'Rudrapur', 'Rishikesh', 'Nainital', 'Mussoorie', 'Kotdwar'],
  'West Bengal': ['Kolkata', 'Asansol', 'Siliguri', 'Durgapur', 'Bardhaman', 'Malda', 'Barasat', 'Krishnanagar', 'Kharagpur', 'Haldia', 'Howrah', 'Habra', 'Cooch Behar', 'Jalpaiguri', 'Bankura'],
  'Andaman & Nicobar': ['Port Blair', 'Diglipur', 'Car Nicobar', 'Rangat'],
  'Chandigarh': ['Chandigarh', 'Manimajra'],
  'D&NH and D&D': ['Daman', 'Diu', 'Silvassa', 'Dadra'],
  'Delhi': ['New Delhi', 'Dwarka', 'Rohini', 'Pitampura', 'Janakpuri', 'Karol Bagh', 'Lajpat Nagar', 'Saket', 'Vasant Kunj', 'Greater Kailash', 'Hauz Khas', 'Mayur Vihar', 'Shahdara', 'Preet Vihar', 'Uttam Nagar', 'Paschim Vihar', 'Rajouri Garden', 'Vikaspuri', 'Narela'],
  'J&K': ['Srinagar', 'Jammu', 'Anantnag', 'Baramulla', 'Sopore', 'Kupwara', 'Pulwama', 'Kathua', 'Udhampur', 'Rajouri'],
  'Ladakh': ['Leh', 'Kargil', 'Diskit', 'Nubra'],
  'Lakshadweep': ['Kavaratti', 'Agatti', 'Andrott', 'Minicoy'],
  'Puducherry': ['Puducherry', 'Oulgaret', 'Karaikal', 'Yanam', 'Mahe']
};

export default function CreatorProfile() {
  const { user, creatorProfile, updateCreatorProfile } = useAuth();
  const { notify } = useContext(NotificationContext);

  const [isEditing, setIsEditing] = useState(false);
  const [editDisplayName, setEditDisplayName] = useState('');
  const [editPhoneNumber, setEditPhoneNumber] = useState('');
  const [editInstagramProfileUrl, setEditInstagramProfileUrl] = useState('');
  const [editYoutubeChannelUrl, setEditYoutubeChannelUrl] = useState('');
  const [editNiches, setEditNiches] = useState([]);
  const [editState, setEditState] = useState('');
  const [editCity, setEditCity] = useState('');
  const [editCurrentChallenge, setEditCurrentChallenge] = useState('');
  const [editExpectedSupport, setEditExpectedSupport] = useState('');
  const [editLoading, setEditLoading] = useState(false);

  // Queries for autocomplete search inputs
  const [nicheQuery, setNicheQuery] = useState('');
  const [stateQuery, setStateQuery] = useState('');
  const [cityQuery, setCityQuery] = useState('');

  // Handle switching to edit mode
  const handleStartEdit = () => {
    if (!creatorProfile) return;
    setEditDisplayName(creatorProfile.displayName || '');
    setEditPhoneNumber(creatorProfile.phoneNumber || '');
    setEditInstagramProfileUrl(creatorProfile.instagramProfileUrl || creatorProfile.instagramUrl || '');
    setEditYoutubeChannelUrl(creatorProfile.youtubeChannelUrl || creatorProfile.youtubeUrl || '');
    setEditNiches(creatorProfile.niches || []);
    setEditState(creatorProfile.state || '');
    setEditCity(creatorProfile.city || '');
    setEditCurrentChallenge(creatorProfile.currentChallenge || '');
    setEditExpectedSupport(creatorProfile.expectedSupport || '');
    setNicheQuery('');
    setStateQuery('');
    setCityQuery('');
    setIsEditing(true);
  };

  // Handle cancelling edit mode
  const handleCancelEdit = () => {
    setIsEditing(false);
    setNicheQuery('');
    setStateQuery('');
    setCityQuery('');
  };

  // Filtered lists for autocomplete
  const filteredStates = stateQuery
    ? STATES.filter((s) => s.toLowerCase().includes(stateQuery.toLowerCase()))
    : [];

  const citiesList = editState ? CITIES[editState] || [] : [];
  const filteredCities = cityQuery
    ? citiesList.filter((c) => c.toLowerCase().includes(cityQuery.toLowerCase()))
    : [];

  // Normalize YouTube link structure
  const normalizeYoutubeChannel = (input) => {
    if (!input) return '';
    let value = input.trim();
    if (value.startsWith('@')) {
      return `https://www.youtube.com/${value}`;
    }
    if (/^youtube\.com\/@/i.test(value)) {
      return `https://www.${value}`;
    }
    if (/^www\.youtube\.com\/@/i.test(value)) {
      return `https://${value}`;
    }
    if (/^[A-Za-z0-9._-]+$/i.test(value)) {
      return `https://www.youtube.com/@${value}`;
    }
    if (/^https?:\/\/(www\.)?youtube\.com\/@/i.test(value)) {
      return value;
    }
    return value;
  };

  // Normalize Instagram URL
  const normalizeInstagramUrl = (input) => {
    if (!input) return '';
    let value = input.trim();
    if (/^https?:\/\/(www\.)?instagram\.com\//i.test(value)) {
      return value;
    }
    if (/^instagram\.com\//i.test(value)) {
      return `https://${value}`;
    }
    const cleanHandle = value.replace('@', '').trim();
    return `https://instagram.com/${cleanHandle}`;
  };

  // Save profile changes
  const handleSaveEdit = async () => {
    if (!editDisplayName.trim()) {
      notify({ message: 'Display Name is required', type: 'error' });
      return;
    }
    if (!editPhoneNumber.trim()) {
      notify({ message: 'Phone Number is required', type: 'error' });
      return;
    }
    const cleanPhone = editPhoneNumber.replace(/[\s\-+()]/g, '');
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      notify({ message: 'Enter a valid 10-digit Indian phone number', type: 'error' });
      return;
    }
    if (editNiches.length === 0) {
      notify({ message: 'Select at least 1 niche', type: 'error' });
      return;
    }
    if (!editState.trim()) {
      notify({ message: 'State is required', type: 'error' });
      return;
    }
    if (!STATES.includes(editState.trim())) {
      notify({ message: 'Please select a valid State from the list', type: 'error' });
      return;
    }
    if (!editCity.trim()) {
      notify({ message: 'City is required', type: 'error' });
      return;
    }
    const stateCities = CITIES[editState] || [];
    if (!stateCities.includes(editCity.trim())) {
      notify({ message: 'Please select a valid City in the chosen State', type: 'error' });
      return;
    }

    const payload = {
      displayName: editDisplayName.trim(),
      phoneNumber: editPhoneNumber.trim(),
      youtubeChannelUrl: editYoutubeChannelUrl.trim() ? normalizeYoutubeChannel(editYoutubeChannelUrl) : '',
      instagramProfileUrl: editInstagramProfileUrl.trim() ? normalizeInstagramUrl(editInstagramProfileUrl) : '',
      niches: editNiches,
      state: editState.trim(),
      city: editCity.trim(),
      currentChallenge: editCurrentChallenge.trim(),
      expectedSupport: editExpectedSupport.trim(),
      startingPrice: creatorProfile?.startingPrice || creatorProfile?.pitchAmount || 0
    };

    setEditLoading(true);
    try {
      const saved = await creatorService.updateCreatorProfile(payload);
      updateCreatorProfile(saved);
      setIsEditing(false);
      notify({ message: 'Changes saved successfully!', type: 'success' });
    } catch (err) {
      console.error(err);
      notify({ message: err.response?.data?.message || 'Failed to update profile changes.', type: 'error' });
    } finally {
      setEditLoading(false);
    }
  };

  // Helper to extract clickable URLs
  const getCleanUrl = (url, type) => {
    if (!url) return null;
    let val = url.trim();
    if (/^https?:\/\//i.test(val)) return val;
    if (val.toLowerCase().startsWith('instagram.com/') || val.toLowerCase().startsWith('youtube.com/') || val.toLowerCase().startsWith('youtu.be/')) {
      return `https://${val}`;
    }
    const cleanHandle = val.replace('@', '').trim();
    if (type === 'instagram') return `https://instagram.com/${cleanHandle}`;
    if (type === 'youtube') return `https://youtube.com/@${cleanHandle}`;
    return `https://${val}`;
  };

  const cleanInstagramUrl = getCleanUrl(creatorProfile?.instagramProfileUrl || creatorProfile?.instagramUrl, 'instagram');
  const cleanYoutubeUrl = getCleanUrl(creatorProfile?.youtubeChannelUrl || creatorProfile?.youtubeUrl, 'youtube');

  // Dynamically calculate completion percentage
  const getProfileCompletion = (profile) => {
    if (!profile) return 0;
    const fields = [
      profile.displayName,
      profile.phoneNumber,
      profile.youtubeChannelUrl || profile.youtubeUrl,
      profile.instagramProfileUrl || profile.instagramUrl,
      Array.isArray(profile.niches) && profile.niches.length > 0,
      profile.state,
      profile.city,
      profile.currentChallenge,
      profile.expectedSupport,
      (profile.startingPrice || profile.pitchAmount)
    ];
    const filled = fields.filter((val) => {
      if (typeof val === 'boolean') return val;
      if (typeof val === 'number') return val > 0;
      return val && val.toString().trim() !== '';
    }).length;
    return Math.round((filled / fields.length) * 100);
  };

  const completionPercent = getProfileCompletion(creatorProfile);

  if (!creatorProfile) return null;

  return (
    <div style={{ animation: 'cIn .35s var(--spring) both' }}>
      
      {/* 1. PROFILE HEADER CARD */}
      <div className="profile-header-container">
        <div className="profile-card" style={{ padding: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
              
              {/* Profile Image Initials Avatar */}
              <div style={{ position: 'relative' }}>
                <div style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: '50%',
                  background: 'var(--lime-tint)',
                  border: '3px solid var(--lime)',
                  color: 'var(--lime-dark)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 600,
                  fontSize: '28px',
                  textTransform: 'uppercase',
                  boxShadow: '0 4px 10px rgba(168, 230, 61, 0.15)',
                  transition: 'transform 0.2s ease'
                }}>
                  {creatorProfile.displayName ? creatorProfile.displayName.charAt(0) : (user?.fullName || 'U').charAt(0)}
                </div>
                
                {/* Pencil Edit Icon Indicator */}
                {isEditing && (
                  <div style={{
                    position: 'absolute',
                    bottom: '2px',
                    right: '2px',
                    background: 'var(--lime)',
                    border: '2px solid var(--white)',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                  }}>
                    <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="var(--lime-dark)" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Creator Metadata */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                  <h2 style={{ fontSize: '22px', fontWeight: 600, margin: 0, color: 'var(--ink)' }}>
                    {creatorProfile.displayName || user?.fullName || 'Creator Profile'}
                  </h2>
                  
                  {/* Verified Badge Placeholder */}
                  <span style={{
                    background: 'var(--lime-tint)',
                    borderColor: 'var(--lime)',
                    color: 'var(--lime-dark)',
                    border: '1.5px solid var(--lime)',
                    fontSize: '11px',
                    fontWeight: 600,
                    padding: '3px 8px',
                    borderRadius: '100px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6.267 3.455a.75.75 0 00-.708-.522H4.5a2.5 2.5 0 00-2.5 2.5v1.055a.75.75 0 00.522.708L3.9 7.633a1.5 1.5 0 01.378.91l.162 1.954a2.5 2.5 0 002.49 2.296h6.14a2.5 2.5 0 002.49-2.295l.162-1.955a1.5 1.5 0 01.378-.91l1.378-1.436a.75.75 0 00.522-.708V5.433a2.5 2.5 0 00-2.5-2.5h-1.06a.75.75 0 00-.707.522L11.9 4.904a1.5 1.5 0 01-1.414 1.042H9.514A1.5 1.5 0 018.1 4.904L6.267 3.455zM10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    Verified
                  </span>
                </div>
                
                <p style={{ fontSize: '13px', color: 'var(--muted)', margin: 0 }}>
                  {creatorProfile.city && creatorProfile.state ? `${creatorProfile.city}, ${creatorProfile.state}` : 'Location incomplete'}
                </p>
              </div>

            </div>

            {/* Profile Completion Indicator */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '220px', flexGrow: 1, maxWidth: '300px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Profile Strength</span>
                <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--lime-dark)' }}>{completionPercent}%</span>
              </div>
              <div style={{ height: '8px', background: 'var(--border)', borderRadius: '100px', width: '100%', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  background: 'linear-gradient(90deg, var(--lime), var(--lime-light))',
                  width: `${completionPercent}%`,
                  borderRadius: '100px',
                  transition: 'width 0.6s cubic-bezier(0.1, 0.8, 0.2, 1)'
                }} />
              </div>
              
              {!isEditing && (
                <button
                  type="button"
                  className="btn btn-lime btn-sm"
                  style={{ alignSelf: 'flex-start', margin: '4px 0 0' }}
                  onClick={handleStartEdit}
                >
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '6px' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Update Profile
                </button>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* TWO COLUMN GRID FOR SUB-CARDS */}
      <div className="profile-grid">
        
        {/* LEFT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* 2. PERSONAL INFORMATION CARD */}
          <div className="profile-card">
            <h3 className="profile-card-title">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" style={{ color: 'var(--muted)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Personal Information
            </h3>

            {isEditing ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '6px' }}>Full Name</label>
                  <input
                    type="text"
                    className="f-input"
                    value={editDisplayName}
                    onChange={(e) => setEditDisplayName(e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '6px' }}>Email Address (Read-Only)</label>
                  <input
                    type="text"
                    className="f-input"
                    value={user?.email || ''}
                    disabled
                    style={{ width: '100%', opacity: 0.65, cursor: 'not-allowed', background: 'rgba(0,0,0,0.02)' }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '6px' }}>Phone Number</label>
                  <input
                    type="text"
                    className="f-input"
                    value={editPhoneNumber}
                    onChange={(e) => setEditPhoneNumber(e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>

                {/* State with Autocomplete selection */}
                <div style={{ position: 'relative' }}>
                  <label style={{ display: 'block', fontSize: '11px', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '6px' }}>State</label>
                  <input
                    type="text"
                    className="f-input"
                    placeholder="Search Indian state..."
                    value={stateQuery || editState}
                    onChange={(e) => {
                      setStateQuery(e.target.value);
                      setEditState('');
                      setEditCity('');
                      setCityQuery('');
                    }}
                    style={{ width: '100%' }}
                  />
                  {stateQuery && filteredStates.length > 0 && (
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      background: 'var(--white)',
                      border: '1.5px solid var(--border)',
                      borderRadius: 'var(--r-md)',
                      maxHeight: '160px',
                      overflowY: 'auto',
                      zIndex: 10,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                    }}>
                      {filteredStates.map((s) => (
                        <div
                          key={s}
                          onClick={() => {
                            setEditState(s);
                            setStateQuery('');
                          }}
                          style={{ padding: '10px 14px', cursor: 'pointer', borderBottom: '1px solid rgba(0,0,0,0.03)', fontSize: '13px' }}
                          onMouseOver={(e) => e.currentTarget.style.background = 'var(--lime-tint)'}
                          onMouseOut={(e) => e.currentTarget.style.background = 'none'}
                        >
                          {s}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* City with Autocomplete selection */}
                <div style={{ position: 'relative' }}>
                  <label style={{ display: 'block', fontSize: '11px', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '6px' }}>City</label>
                  <input
                    type="text"
                    className="f-input"
                    placeholder="Search city..."
                    value={cityQuery || editCity}
                    disabled={!editState}
                    onChange={(e) => {
                      setCityQuery(e.target.value);
                      setEditCity('');
                    }}
                    style={{ width: '100%', opacity: editState ? 1 : 0.6 }}
                  />
                  {editState && cityQuery && filteredCities.length > 0 && (
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      background: 'var(--white)',
                      border: '1.5px solid var(--border)',
                      borderRadius: 'var(--r-md)',
                      maxHeight: '160px',
                      overflowY: 'auto',
                      zIndex: 10,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                    }}>
                      {filteredCities.map((c) => (
                        <div
                          key={c}
                          onClick={() => {
                            setEditCity(c);
                            setCityQuery('');
                          }}
                          style={{ padding: '10px 14px', cursor: 'pointer', borderBottom: '1px solid rgba(0,0,0,0.03)', fontSize: '13px' }}
                          onMouseOver={(e) => e.currentTarget.style.background = 'var(--lime-tint)'}
                          onMouseOut={(e) => e.currentTarget.style.background = 'none'}
                        >
                          {c}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ background: 'var(--surface)', padding: '12px 16px', borderRadius: 'var(--r-md)', border: '1px solid var(--border)' }}>
                  <span style={{ display: 'block', fontSize: '10px', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Full Name</span>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--ink)' }}>{creatorProfile.displayName || 'Not Provided'}</span>
                </div>
                
                <div style={{ background: 'var(--surface)', padding: '12px 16px', borderRadius: 'var(--r-md)', border: '1px solid var(--border)' }}>
                  <span style={{ display: 'block', fontSize: '10px', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Email Address</span>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--ink)' }}>{user?.email || 'Not Provided'}</span>
                </div>
                
                <div style={{ background: 'var(--surface)', padding: '12px 16px', borderRadius: 'var(--r-md)', border: '1px solid var(--border)' }}>
                  <span style={{ display: 'block', fontSize: '10px', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Phone Number</span>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--ink)' }}>{creatorProfile.phoneNumber || 'Not Provided'}</span>
                </div>
                
                <div style={{ background: 'var(--surface)', padding: '12px 16px', borderRadius: 'var(--r-md)', border: '1px solid var(--border)' }}>
                  <span style={{ display: 'block', fontSize: '10px', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>State</span>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--ink)' }}>{creatorProfile.state || 'Not Provided'}</span>
                </div>
                
                <div style={{ background: 'var(--surface)', padding: '12px 16px', borderRadius: 'var(--r-md)', border: '1px solid var(--border)' }}>
                  <span style={{ display: 'block', fontSize: '10px', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>City</span>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--ink)' }}>{creatorProfile.city || 'Not Provided'}</span>
                </div>
              </div>
            )}
          </div>

          {/* 3. CONTENT NICHES CARD */}
          <div className="profile-card">
            <h3 className="profile-card-title">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" style={{ color: 'var(--muted)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
              Content Niches
            </h3>

            {isEditing ? (
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '10px' }}>Selected Niches ({editNiches.length}/5)</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                  {editNiches.map((n) => (
                    <span
                      key={n}
                      className="niche-chip active"
                      style={{ margin: 0, paddingRight: '10px' }}
                      onClick={() => setEditNiches(editNiches.filter((item) => item !== n))}
                    >
                      {n} <span style={{ marginLeft: '4px', fontWeight: 'bold' }}>&times;</span>
                    </span>
                  ))}
                  {editNiches.length === 0 && (
                    <span style={{ fontSize: '13px', color: 'var(--red)', fontWeight: 500 }}>Select at least 1 niche category</span>
                  )}
                </div>
                
                <input
                  type="text"
                  className="f-input"
                  placeholder="Type to search and add niche..."
                  value={nicheQuery}
                  onChange={(e) => setNicheQuery(e.target.value)}
                  style={{ width: '100%' }}
                />
                
                {nicheQuery && (
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '8px',
                    marginTop: '8px',
                    padding: '10px',
                    background: 'rgba(0,0,0,0.02)',
                    borderRadius: 'var(--r-md)',
                    border: '1.5px solid var(--border)',
                    maxHeight: '120px',
                    overflowY: 'auto'
                  }}>
                    {NICHES.filter(n => n.toLowerCase().includes(nicheQuery.toLowerCase()) && !editNiches.includes(n)).slice(0, 8).map((n) => (
                      <span
                        key={n}
                        className="niche-chip"
                        style={{ margin: 0 }}
                        onClick={() => {
                          if (editNiches.length >= 5) {
                            notify({ message: 'Maximum 5 niches allowed', type: 'error' });
                            return;
                          }
                          setEditNiches([...editNiches, n]);
                          setNicheQuery('');
                        }}
                      >
                        + {n}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {Array.isArray(creatorProfile.niches) && creatorProfile.niches.length > 0 ? (
                  creatorProfile.niches.map((n) => (
                    <span key={n} className="niche-chip active" style={{ margin: 0, cursor: 'default' }}>
                      {n}
                    </span>
                  ))
                ) : (
                  <span style={{ fontSize: '13.5px', color: 'var(--muted)', fontWeight: 500 }}>Not Provided</span>
                )}
              </div>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* 4. SOCIAL LINKS CARD */}
          <div className="profile-card">
            <h3 className="profile-card-title">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" style={{ color: 'var(--muted)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              Social Links
            </h3>

            {isEditing ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '6px' }}>Instagram URL</label>
                  <input
                    type="text"
                    className="f-input"
                    placeholder="instagram.com/handle"
                    value={editInstagramProfileUrl}
                    onChange={(e) => setEditInstagramProfileUrl(e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '6px' }}>YouTube URL</label>
                  <input
                    type="text"
                    className="f-input"
                    placeholder="youtube.com/@channel"
                    value={editYoutubeChannelUrl}
                    onChange={(e) => setEditYoutubeChannelUrl(e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                
                {/* Instagram Display */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--surface)', padding: '12px 16px', borderRadius: 'var(--r-md)', border: '1px solid var(--border)' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#E1306C', flexShrink: 0 }}>
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <span style={{ display: 'block', fontSize: '9px', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '2px' }}>Instagram</span>
                    {cleanInstagramUrl ? (
                      <a href={cleanInstagramUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--lime-dark)', textDecoration: 'underline', wordBreak: 'break-all' }}>
                        {cleanInstagramUrl}
                      </a>
                    ) : (
                      <span style={{ fontSize: '13.5px', color: 'var(--muted)' }}>Not Provided</span>
                    )}
                  </div>
                </div>

                {/* YouTube Display */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--surface)', padding: '12px 16px', borderRadius: 'var(--r-md)', border: '1px solid var(--border)' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#FF0000', flexShrink: 0 }}>
                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" />
                  </svg>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <span style={{ display: 'block', fontSize: '9px', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '2px' }}>YouTube</span>
                    {cleanYoutubeUrl ? (
                      <a href={cleanYoutubeUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--lime-dark)', textDecoration: 'underline', wordBreak: 'break-all' }}>
                        {cleanYoutubeUrl}
                      </a>
                    ) : (
                      <span style={{ fontSize: '13.5px', color: 'var(--muted)' }}>Not Provided</span>
                    )}
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* 5. CURRENT CHALLENGE CARD */}
          <div className="profile-card">
            <h3 className="profile-card-title">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" style={{ color: 'var(--muted)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Current Challenge
            </h3>

            {isEditing ? (
              <div>
                <textarea
                  className="f-textarea"
                  value={editCurrentChallenge}
                  onChange={(e) => setEditCurrentChallenge(e.target.value)}
                  placeholder="Describe your biggest creator challenge..."
                  style={{ minHeight: '120px', width: '100%' }}
                />
              </div>
            ) : (
              <div style={{
                background: 'var(--surface)',
                padding: '14px 16px',
                borderRadius: 'var(--r-md)',
                border: '1px solid var(--border)',
                color: 'var(--ink)',
                fontSize: '13.5px',
                lineHeight: 1.6,
                whiteSpace: 'pre-wrap',
                minHeight: '80px'
              }}>
                {creatorProfile.currentChallenge || <span style={{ color: 'var(--muted)', fontStyle: 'italic' }}>Not Provided</span>}
              </div>
            )}
          </div>

          {/* 6. EXPECTED SUPPORT CARD */}
          <div className="profile-card">
            <h3 className="profile-card-title">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" style={{ color: 'var(--muted)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Expected Support
            </h3>

            {isEditing ? (
              <div>
                <textarea
                  className="f-textarea"
                  value={editExpectedSupport}
                  onChange={(e) => setEditExpectedSupport(e.target.value)}
                  placeholder="What support are you expecting from NexUp?"
                  style={{ minHeight: '120px', width: '100%' }}
                />
              </div>
            ) : (
              <div style={{
                background: 'var(--surface)',
                padding: '14px 16px',
                borderRadius: 'var(--r-md)',
                border: '1px solid var(--border)',
                color: 'var(--ink)',
                fontSize: '13.5px',
                lineHeight: 1.6,
                whiteSpace: 'pre-wrap',
                minHeight: '80px'
              }}>
                {creatorProfile.expectedSupport || <span style={{ color: 'var(--muted)', fontStyle: 'italic' }}>Not Provided</span>}
              </div>
            )}
          </div>

        </div>

      </div>

      {/* 7. BOTTOM ACTION BAR (STICKY BOTTOM) */}
      {isEditing && (
        <div className="sticky-action-bar">
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={handleCancelEdit}
            disabled={editLoading}
            style={{ margin: 0 }}
          >
            Cancel
          </button>
          
          <button
            type="button"
            className="btn btn-lime btn-sm"
            onClick={handleSaveEdit}
            disabled={editLoading}
            style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            {editLoading ? (
              <div className="spin" style={{ width: '14px', height: '14px' }}></div>
            ) : (
              <>
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      )}

    </div>
  );
}
