import { useEffect, useState, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.js';
import { creatorService } from '../../services/creatorService.js';
import { NotificationContext } from '../../context/NotificationContext.jsx';
import { ROUTES } from '../../constants/routes.js';

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

const AGREEMENT_TEXTS = [
  'my content is original and authentically created by me.',
  "i'll represent NexUp with integrity - no spam, no bad vibes.",
  "i understand brand deals depend on fit and aren't guaranteed for every creator.",
  "i'll engage genuinely with the community and support fellow creators.",
  'i am open to feedback and iteration on my content.',
  'i accept all the terms and conditions.'
];

export default function CreatorPage({ onComplete }) {
  const { user, updateCreatorProfile } = useAuth();
  const { notify } = useContext(NotificationContext);
  const navigate = useNavigate();

  // Wizard state (1 to 12)
  const [currentStep, setCurrentStep] = useState(1);

  // Payload states
  const [displayName, setDisplayName] = useState(user?.fullName || user?.fullName || user?.full_name || user?.name || '');
  const [contactEmail, setContactEmail] = useState(user?.email || '');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [youtubeChannelUrl, setYoutubeChannelUrl] = useState('');
  const [instagramProfileUrl, setInstagramProfileUrl] = useState('');
  const [niches, setNiches] = useState([]);
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [currentChallenge, setCurrentChallenge] = useState('');
  const [expectedSupport, setExpectedSupport] = useState('');
  const [startingPrice, setStartingPrice] = useState('');
  const [agreements, setAgreements] = useState(Array(AGREEMENT_TEXTS.length).fill(false));

  // Autocomplete queries
  const [nicheQuery, setNicheQuery] = useState('');
  const [stateQuery, setStateQuery] = useState('');
  const [cityQuery, setCityQuery] = useState('');

  // UI state
  const [formError, setFormError] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [isOnboardingSuccess, setIsOnboardingSuccess] = useState(false);

  const inputRef = useRef(null);

  // Auto-focus input on step change
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentStep]);

  // Sync email/name if they load asynchronously
  useEffect(() => {
    if (user) {
      if (!displayName) setDisplayName(user.fullName || user.fullName || user.full_name || user.name || '');
      if (!contactEmail) setContactEmail(user.email || '');
    }
  }, [user]);

  // Filter lists
  const filteredNiches = NICHES.filter(
    (n) => n.toLowerCase().includes(nicheQuery.toLowerCase()) && !niches.includes(n)
  );

  const filteredStates = stateQuery
    ? STATES.filter((s) => s.toLowerCase().includes(stateQuery.toLowerCase()))
    : [];

  const citiesList = state ? CITIES[state] || [] : [];
  const filteredCities = cityQuery
    ? citiesList.filter((c) => c.toLowerCase().includes(cityQuery.toLowerCase()))
    : [];

  const handleToggleNiche = (n) => {
    if (niches.includes(n)) {
      setNiches(niches.filter((item) => item !== n));
    } else {
      if (niches.length >= 5) {
        notify({ message: 'Maximum 5 niches allowed', type: 'error' });
        return;
      }
      setNiches([...niches, n]);
    }
    setNicheQuery('');
  };

  const handleAgreementToggle = (idx) => {
    const allIndex = AGREEMENT_TEXTS.length - 1;
    if (idx === allIndex) {
      setAgreements(Array(AGREEMENT_TEXTS.length).fill(!agreements[allIndex]));
      return;
    }
    const next = [...agreements];
    next[idx] = !next[idx];
    next[allIndex] = next.slice(0, allIndex).every(Boolean);
    setAgreements(next);
  };

  const validateStep = (stepNum) => {
    setFormError('');
    if (stepNum === 1) {
      if (!displayName.trim()) return 'Display name is required';
      if (displayName.trim().length < 2) return 'Name must be at least 2 characters';
    }
    if (stepNum === 2) {
      if (!contactEmail.trim()) return 'Contact email is required';
      if (!/\S+@\S+\.\S+/.test(contactEmail)) return 'Please enter a valid email address';
    }
    if (stepNum === 3) {
      if (!phoneNumber.trim()) return 'Phone number is required';
      const cleanPhone = phoneNumber.replace(/[\s\-+()]/g, '');
      if (!/^[6-9]\d{9}$/.test(cleanPhone)) return 'Please enter a valid 10-digit Indian phone number';
    }

 if (stepNum === 4 && youtubeChannelUrl) {

      const cleanYt = youtubeChannelUrl.trim();

      const isValidYoutube =
        /^@[\w.-]+$/i.test(cleanYt) ||                                            // @StudyIQ
        /^[A-Za-z0-9._-]+$/i.test(cleanYt) ||                                     // StudyIQ
        /^(https?:\/\/)?(www\.)?youtube\.com\/@[\w.-]+\/?$/i.test(cleanYt) ||     // https://www.youtube.com/@StudyIQ
        /^(www\.)?youtube\.com\/@[\w.-]+\/?$/i.test(cleanYt);                     // www.youtube.com/@StudyIQ

      if (!isValidYoutube) {
        return 'Please enter a valid YouTube channel';
      }

}

    if (stepNum === 5 && instagramProfileUrl) {
      const cleanIg = instagramProfileUrl.trim().toLowerCase();
      if (!cleanIg.includes('instagram.com/')) {
        return 'Please enter a valid Instagram profile URL';
      }
    }
    if (stepNum === 6) {
      if (niches.length === 0) return 'Please select at least 1 niche category';
      if (niches.length > 5) return 'Maximum 5 niches allowed';
    }
    if (stepNum === 7) {
      if (!state) return 'Please select your state';
      if (!STATES.includes(state)) return 'Invalid state selection';
    }
    if (stepNum === 8) {
      if (!city) return 'Please select your city';
      if (!citiesList.includes(city)) return 'Invalid city selection';
    }
    if (stepNum === 9) {
      if (!currentChallenge.trim()) return 'Challenge description is required';
    }
    if (stepNum === 10) {
      if (!expectedSupport.trim()) return 'Expected support description is required';
    }
    if (stepNum === 11) {
      if (!startingPrice) return 'Starting pricing rate is required';
      if (parseFloat(startingPrice) <= 0) return 'Price must be greater than zero';
    }
    if (stepNum === 12) {
      if (agreements.some((val) => !val)) return 'Please check all agreements to proceed';
    }
    return null;
  };

  const handleNext = () => {
    const error = validateStep(currentStep);
    if (error) {
      setFormError(error);
      notify({ message: error, type: 'error' });
      return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, 12));
  };

  const handleBack = () => {
    setFormError('');
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (currentStep < 12) {
        e.preventDefault();
        handleNext();
      }
    }
  };

  const handleOnboardingSubmit = async () => {
    const error = validateStep(12);
    if (error) {
      setFormError(error);
      notify({ message: error, type: 'error' });
      return;
    }



    const normalizeYoutubeChannel = (input) => {

            if (!input) return '';

            let value = input.trim();

            // @channel
            if (value.startsWith('@')) {
              return `https://www.youtube.com/${value}`;
            }

            // youtube.com/@channel
            if (/^youtube\.com\/@/i.test(value)) {
              return `https://www.${value}`;
            }

            // www.youtube.com/@channel
            if (/^www\.youtube\.com\/@/i.test(value)) {
              return `https://${value}`;
            }

            // Only channel handle
            if (/^[A-Za-z0-9._-]+$/i.test(value)) {
              return `https://www.youtube.com/@${value}`;
            }

            // Already a complete YouTube URL
              if (/^https?:\/\/(www\.)?youtube\.com\/@/i.test(value)) {
                  return value;
              }

           
            return value;

          };


      const payload = {
        displayName: displayName || '',
        phoneNumber: phoneNumber || '',
        youtubeChannelUrl: youtubeChannelUrl ? normalizeYoutubeChannel(youtubeChannelUrl): '',
        instagramProfileUrl: instagramProfileUrl || '',
        niches: niches || [],
        state: state || '',
        city: city || '',
        currentChallenge: currentChallenge || '',
        expectedSupport: expectedSupport || '',
        startingPrice: parseFloat(startingPrice) || 0
      };

      console.log("Final Form State", payload);

      setSubmitLoading(true);
      try {
        const saved = await creatorService.onboardCreator(payload);
        updateCreatorProfile(saved);
        setIsOnboardingSuccess(true);
        notify({ message: 'Creator profile onboarded successfully!', type: 'success' });
        
        if (onComplete) {
          onComplete(saved);
        } else {
          setTimeout(() => {
            navigate(ROUTES.HOME);
        }, 2200);
      }
    } catch (err) {
      console.error(err);
      setFormError(err.response?.data?.message || 'Failed to submit onboarding profile details.');
      notify({ message: 'Submission failed', type: 'error' });
    } finally {
      setSubmitLoading(false);
    }
  };

  if (isOnboardingSuccess) {
    return (
      <div className="stage" style={{ minHeight: 'calc(100vh - 120px)' }}>
        <div className="form-card" style={{ textAlign: 'center', padding: '48px 32px', animation: 'cIn .5s var(--spring) both' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'var(--lime-tint)',
            border: '2.5px solid var(--lime)',
            color: 'var(--lime-dark)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            animation: 'toastIn .6s var(--spring) forwards'
          }}>
            <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 600, color: 'var(--ink)', marginBottom: '8px' }}>Onboarding Completed!</h2>
          <p style={{ fontSize: '14px', color: 'var(--muted)', margin: '0 auto 24px', maxWidth: '320px', lineHeight: 1.6 }}>
            Welcome to the community! We are matching you with brand campaigns and collabs right now.
          </p>
          {!onComplete && <div style={{ fontSize: '12px', color: 'var(--lime-dark)', fontWeight: 600 }}>Redirecting to Home page...</div>}
        </div>
      </div>
    );
  }

  return (
    <div className="stage" style={{ minHeight: 'calc(100vh - 120px)', justifyContent: 'flex-start', padding: '24px 8px' }}>
      <div className="card-wrap" style={{ width: '100%', maxWidth: '580px', zIndex: 2 }}>
        <div className="form-card" style={{ animation: 'cIn .45s var(--spring) both' }}>
          
          {/* Header Progress indicator */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '12px', textTransform: 'uppercase', fontWeight: 600, color: 'var(--lime-dark)', letterSpacing: '0.05em' }}>
              Creator Onboarding
            </span>
            <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--muted)' }}>
              Step {currentStep} of 12
            </span>
          </div>

          <div style={{ height: '4px', background: 'var(--border)', borderRadius: '100px', width: '100%', marginBottom: '28px', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              background: 'var(--lime)',
              width: `${(currentStep / 12) * 100}%`,
              borderRadius: '100px',
              transition: 'width 0.3s ease'
            }} />
          </div>

          {formError && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.08)',
              border: '1.5px solid rgba(239, 68, 68, 0.15)',
              borderRadius: 'var(--r-md)',
              padding: '10px 14px',
              color: 'var(--red)',
              fontSize: '13px',
              marginBottom: '20px',
              fontWeight: 500
            }}>
              {formError}
            </div>
          )}

          {/* STEP 1: Display Name */}
          {currentStep === 1 && (
            <div style={{ animation: 'cIn .3s ease both' }}>
              <span className="cta-badge" style={{ marginBottom: '8px' }}>let's get started</span>
              <h2 style={{ fontSize: '22px', fontWeight: 500, color: 'var(--ink)', marginBottom: '6px' }}>what should we call you?</h2>
              <p style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '20px' }}>your full name - no numbers, just your real name</p>
              <input
                ref={inputRef}
                type="text"
                className="f-input"
                placeholder="full name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
          )}

          {/* STEP 2: Email */}
          {currentStep === 2 && (
            <div style={{ animation: 'cIn .3s ease both' }}>
              <span className="cta-badge" style={{ marginBottom: '8px' }}>contact</span>
              <h2 style={{ fontSize: '22px', fontWeight: 500, color: 'var(--ink)', marginBottom: '6px' }}>your email address?</h2>
              <p style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '20px' }}>we'll reach out here - use one you actually check</p>
              <input
                ref={inputRef}
                type="email"
                className="f-input"
                placeholder="you@example.com"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
          )}

          {/* STEP 3: Phone */}
          {currentStep === 3 && (
            <div style={{ animation: 'cIn .3s ease both' }}>
              <span className="cta-badge" style={{ marginBottom: '8px' }}>contact</span>
              <h2 style={{ fontSize: '22px', fontWeight: 500, color: 'var(--ink)', marginBottom: '6px' }}>your phone number?</h2>
              <p style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '20px' }}>10-digit indian mobile number</p>
              <input
                ref={inputRef}
                type="text"
                className="f-input"
                placeholder="+91 98765 43210"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
          )}

          {/* STEP 4: YouTube URL */}
          {currentStep === 4 && (
            <div style={{ animation: 'cIn .3s ease both' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <h2 style={{ fontSize: '22px', fontWeight: 500, color: 'var(--ink)', margin: 0 }}>drop your youtube channel link</h2>
                <button
                  type="button"
                  onClick={() => { setYoutubeChannelUrl(''); handleNext(); }}
                  style={{ background: 'none', border: 'none', color: 'var(--lime-dark)', fontWeight: 600, cursor: 'pointer', fontSize: '13px' }}
                >
                  Skip
                </button>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '20px' }}>optional - paste your channel home url</p>
              <input
                ref={inputRef}
                type="text"
                className="f-input"
                placeholder="youtube.com/@yourchannel"
                value={youtubeChannelUrl}
                onChange={(e) => setYoutubeChannelUrl(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
          )}

          {/* STEP 5: Instagram URL */}
          {currentStep === 5 && (
            <div style={{ animation: 'cIn .3s ease both' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <h2 style={{ fontSize: '22px', fontWeight: 500, color: 'var(--ink)', margin: 0 }}>drop your instagram profile link</h2>
                <button
                  type="button"
                  onClick={() => { setInstagramProfileUrl(''); handleNext(); }}
                  style={{ background: 'none', border: 'none', color: 'var(--lime-dark)', fontWeight: 600, cursor: 'pointer', fontSize: '13px' }}
                >
                  Skip
                </button>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '20px' }}>optional - paste your instagram profile url</p>
              <input
                ref={inputRef}
                type="text"
                className="f-input"
                placeholder="instagram.com/yourhandle"
                value={instagramProfileUrl}
                onChange={(e) => setInstagramProfileUrl(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
          )}

          {/* STEP 6: Niches */}
          {currentStep === 6 && (
            <div style={{ animation: 'cIn .3s ease both' }}>
              <span className="cta-badge" style={{ marginBottom: '8px' }}>content niche</span>
              <h2 style={{ fontSize: '22px', fontWeight: 500, color: 'var(--ink)', marginBottom: '6px' }}>what kind of content do you make?</h2>
              <p style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '16px' }}>select up to 5 niches ({niches.length}/5 selected)</p>
              
              <input
                ref={inputRef}
                type="text"
                className="f-input"
                placeholder="search niche..."
                value={nicheQuery}
                onChange={(e) => setNicheQuery(e.target.value)}
                style={{ marginBottom: '14px' }}
              />

              {niches.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                  {niches.map((n) => (
                    <span
                      key={n}
                      onClick={() => handleToggleNiche(n)}
                      className="tag-pill"
                      style={{ margin: 0, background: 'var(--lime-tint)', borderColor: 'var(--lime)', color: 'var(--lime-dark)', cursor: 'pointer' }}
                    >
                      {n} &times;
                    </span>
                  ))}
                </div>
              )}

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', maxHeight: '140px', overflowY: 'auto', padding: '4px' }}>
                {filteredNiches.slice(0, 12).map((n) => (
                  <span
                    key={n}
                    onClick={() => handleToggleNiche(n)}
                    className="niche-chip"
                    style={{ margin: 0 }}
                  >
                    + {n}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* STEP 7: State */}
          {currentStep === 7 && (
            <div style={{ animation: 'cIn .3s ease both' }}>
              <span className="cta-badge" style={{ marginBottom: '8px' }}>location</span>
              <h2 style={{ fontSize: '22px', fontWeight: 500, color: 'var(--ink)', marginBottom: '6px' }}>which state are you based in?</h2>
              <p style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '16px' }}>start typing to search states</p>
              <input
                ref={inputRef}
                type="text"
                className="f-input"
                placeholder="search state..."
                value={stateQuery || state}
                onChange={(e) => {
                  setStateQuery(e.target.value);
                  setState('');
                  setCity('');
                  setCityQuery('');
                }}
              />
              {stateQuery && filteredStates.length > 0 && (
                <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', marginTop: '8px', maxHeight: '180px', overflowY: 'auto', boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }}>
                  {filteredStates.map((s) => (
                    <div
                      key={s}
                      onClick={() => {
                        setState(s);
                        setStateQuery('');
                        setFormError('');
                      }}
                      style={{ padding: '12px 16px', cursor: 'pointer', borderBottom: '1px solid rgba(0,0,0,0.04)', fontSize: '13.5px', transition: 'background 0.2s' }}
                      onMouseOver={(e) => e.currentTarget.style.background = 'var(--lime-tint)'}
                      onMouseOut={(e) => e.currentTarget.style.background = 'none'}
                    >
                      {s}
                    </div>
                  ))}
                </div>
              )}
              {!stateQuery && state && (
                <div style={{ marginTop: '12px', fontSize: '13.5px', color: 'var(--lime-dark)', fontWeight: 600 }}>
                  Selected: {state}
                </div>
              )}
            </div>
          )}

          {/* STEP 8: City */}
          {currentStep === 8 && (
            <div style={{ animation: 'cIn .3s ease both' }}>
              <span className="cta-badge" style={{ marginBottom: '8px' }}>location</span>
              <h2 style={{ fontSize: '22px', fontWeight: 500, color: 'var(--ink)', marginBottom: '6px' }}>and which city?</h2>
              <p style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '16px' }}>selected state: {state}</p>
              <input
                ref={inputRef}
                type="text"
                className="f-input"
                placeholder="search city..."
                value={cityQuery || city}
                onChange={(e) => {
                  setCityQuery(e.target.value);
                  setCity('');
                }}
              />
              {cityQuery && filteredCities.length > 0 && (
                <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', marginTop: '8px', maxHeight: '180px', overflowY: 'auto', boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }}>
                  {filteredCities.map((c) => (
                    <div
                      key={c}
                      onClick={() => {
                        setCity(c);
                        setCityQuery('');
                        setFormError('');
                      }}
                      style={{ padding: '12px 16px', cursor: 'pointer', borderBottom: '1px solid rgba(0,0,0,0.04)', fontSize: '13.5px', transition: 'background 0.2s' }}
                      onMouseOver={(e) => e.currentTarget.style.background = 'var(--lime-tint)'}
                      onMouseOut={(e) => e.currentTarget.style.background = 'none'}
                    >
                      {c}
                    </div>
                  ))}
                </div>
              )}
              {!cityQuery && city && (
                <div style={{ marginTop: '12px', fontSize: '13.5px', color: 'var(--lime-dark)', fontWeight: 600 }}>
                  Selected: {city}
                </div>
              )}
            </div>
          )}

          {/* STEP 9: Current Challenge */}
          {currentStep === 9 && (
            <div style={{ animation: 'cIn .3s ease both' }}>
              <span className="cta-badge" style={{ marginBottom: '8px' }}>growth mode</span>
              <h2 style={{ fontSize: '22px', fontWeight: 500, color: 'var(--ink)', marginBottom: '6px' }}>what are you trying to improve right now as a creator?</h2>
              <p style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '20px' }}>no filter needed here.</p>
              <textarea
                ref={inputRef}
                className="f-textarea"
                placeholder="what's your current challenge..."
                value={currentChallenge}
                onChange={(e) => setCurrentChallenge(e.target.value)}
                style={{ minHeight: '110px' }}
              />
            </div>
          )}

          {/* STEP 10: Expected Support */}
          {currentStep === 10 && (
            <div style={{ animation: 'cIn .3s ease both' }}>
              <span className="cta-badge" style={{ marginBottom: '8px' }}>what you need</span>
              <h2 style={{ fontSize: '22px', fontWeight: 500, color: 'var(--ink)', marginBottom: '6px' }}>what kind of support are you expecting from NexUp?</h2>
              <p style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '20px' }}>brand deals, collabs, mentorship - all of it?</p>
              <textarea
                ref={inputRef}
                className="f-textarea"
                placeholder="what would change the game for you..."
                value={expectedSupport}
                onChange={(e) => setExpectedSupport(e.target.value)}
                style={{ minHeight: '110px' }}
              />
            </div>
          )}

          {/* STEP 11: Starting Price */}
          {currentStep === 11 && (
            <div style={{ animation: 'cIn .3s ease both' }}>
              <span className="cta-badge" style={{ marginBottom: '8px' }}>the business end 🤝</span>
              <h2 style={{ fontSize: '22px', fontWeight: 500, color: 'var(--ink)', marginBottom: '6px' }}>give us an amount to pitch to brands from your side...</h2>
              <p style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '20px' }}>per post / reel / video - your call. don't undersell. (INR ₹)</p>
              <input
                ref={inputRef}
                type="number"
                className="f-input"
                placeholder="5000"
                value={startingPrice}
                onChange={(e) => setStartingPrice(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
          )}

          {/* STEP 12: Final Agreements */}
          {currentStep === 12 && (
            <div style={{ animation: 'cIn .35s ease both' }}>
              <span className="cta-badge" style={{ marginBottom: '8px' }}>final check</span>
              <h2 style={{ fontSize: '22px', fontWeight: 500, color: 'var(--ink)', marginBottom: '6px' }}>a few things before we move forward</h2>
              <p style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '20px' }}>all boxes must be checked</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'left', marginBottom: '24px' }}>
                {AGREEMENT_TEXTS.map((text, idx) => (
                  <label key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', cursor: 'pointer', fontSize: '13.5px', color: 'var(--ink)', lineHeight: 1.4 }}>
                    <input
                      type="checkbox"
                      checked={agreements[idx]}
                      onChange={() => handleAgreementToggle(idx)}
                      style={{ marginTop: '3px', accentColor: 'var(--lime-dark)' }}
                    />
                    <span>{text}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Card Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', marginTop: '28px' }}>
            {currentStep > 1 && (
              <button
                type="button"
                className="btn-back"
                onClick={handleBack}
                disabled={submitLoading}
                style={{ flex: 1 }}
              >
                Back
              </button>
            )}

            {currentStep < 12 ? (
              <button
                type="button"
                className="btn-send"
                onClick={handleNext}
                style={{ flex: 1 }}
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                className="btn-send"
                onClick={handleOnboardingSubmit}
                disabled={submitLoading}
                style={{ flex: 1 }}
              >
                {submitLoading ? (
                  <div className="spin"></div>
                ) : (
                  <span>Submit Profile</span>
                )}
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
