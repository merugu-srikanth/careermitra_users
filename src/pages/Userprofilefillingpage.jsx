import React, { useState, useEffect, useRef } from "react";
import { State, City } from "country-state-city";
import axios from "axios";
import { toast } from "react-toastify";
import Confetti from "react-confetti";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SEO from "../components/SEO";
import { API_ENDPOINTS, getApiMessage, isApiSuccess } from "../utils/api";
import { calculateProfileCompletion } from "../utils/profileCompletion";

// ─── CONSTANTS ───────────────────────────────────────────────────────────────

const CURRENT_YEAR_OPTIONS = ["1st Year", "2nd Year", "3rd Year", "4th Year", "Completed"];

const INTERMEDIATE_COURSES = [
  { code: "MPC", name: "Maths, Physics, Chemistry" },
  { code: "BiPC", name: "Biology, Physics, Chemistry" },
  { code: "MEC", name: "Maths, Economics, Commerce" },
  { code: "CEC", name: "Civics, Economics, Commerce" },
  { code: "HEC", name: "History, Economics, Civics" },
  { code: "Inter voc", name: "Intermediate Vocational" },
  { code: "Other", name: "Any other" },
];

const ITI_TRADES = [
  "Electrician", "Fitter", "Mechanic Motor Vehicle", "Draughtsman Mechanical", "Turner",
  "Machinist", "Welder", "Carpenter", "Plumber", "Mechanic Diesel", "Electronics Mechanic",
  "Refrigeration and Air Conditioning", "Computer Operator and Programming Assistant",
  "Information Technology & ESM", "Instrument Mechanic", "Mechanic Radio & TV",
  "Mechanic Consumer Electronics", "Other",
];

const ENGINEERING_DIPLOMAS = [
  "Civil Engineering", "Architectural Assistantship", "Mechanical Engineering", "Automobile Engineering",
  "Electrical and Electronics Engineering", "Electronics and Communication Engineering",
  "Electronics and Instrumentation Engineering", "Computer Science and Engineering",
  "Metallurgical Engineering", "Chemical Engineering", "Printing Technology", "Packaging Technology",
  "Mining Engineering", "Biomedical Engineering", "Electronics Engineering", "Instrumentation Technology",
  "Aeronautical Engineering", "Biotechnology Engineering", "Textile Engineering",
];

const NON_ENGINEERING_DIPLOMAS = [
  "Commercial and Computer Practices", "Home Science", "Agriculture & Farm Engineering",
  "Seed Technology (offered by PJTSAU)", "Horticulture (offered by SKLTSHU)",
];

const REGULAR_GRADUATION = [
  { code: "B.A.", name: "Bachelor of Arts" },
  { code: "B.Sc.", name: "Bachelor of Science" },
  { code: "B.Com.", name: "Bachelor of Commerce" },
  { code: "BBA", name: "Bachelor of Business Administration" },
  { code: "BCA", name: "Bachelor of Computer Applications" },
  { code: "Other", name: "Other" },
];

const PROFESSIONAL_GRADUATION = [
  { code: "B.Tech.", name: "Bachelor of Technology" },
  { code: "B.E.", name: "Bachelor of Engineering" },
  { code: "B.Arch.", name: "Bachelor of Architecture" },
  { code: "B.Plan.", name: "Bachelor of Planning" },
  { code: "B.Des.", name: "Bachelor of Design" },
  { code: "BFA", name: "Bachelor of Fine Arts" },
  { code: "BPA", name: "Bachelor of Performing Arts" },
  { code: "B.Lib.Sc.", name: "Bachelor of Library and Information Science" },
  { code: "BSW", name: "Bachelor of Social Work" },
  { code: "B.Ed.", name: "Bachelor of Education" },
  { code: "B.P.Ed.", name: "Bachelor of Physical Education" },
  { code: "B.El.Ed.", name: "Bachelor of Elementary Education" },
  { code: "LL.B.", name: "Bachelor of Laws" },
  { code: "BHM", name: "Bachelor of Hotel Management" },
  { code: "BTTM", name: "Bachelor of Tourism and Travel Management" },
  { code: "BMS", name: "Bachelor of Management Studies" },
  { code: "BBS", name: "Bachelor of Business Studies" },
  { code: "BJMC", name: "Bachelor of Journalism and Mass Communication" },
  { code: "B.Sc. (Agriculture)", name: "Bachelor of Science in Agriculture" },
  { code: "B.Sc. (Nursing)", name: "Bachelor of Science in Nursing" },
  { code: "BPT", name: "Bachelor of Physiotherapy" },
  { code: "MBBS", name: "Bachelor of Medicine and Bachelor of Surgery" },
  { code: "BDS", name: "Bachelor of Dental Surgery" },
  { code: "B.Pharm.", name: "Bachelor of Pharmacy" },
  { code: "CA", name: "Chartered Accountant" },
  { code: "CS", name: "Company Secretary" },
  { code: "CMA", name: "Cost & Management Accounting" },
  { code: "Other", name: "Other" },
];

const POST_GRADUATION = [
  { code: "M.A.", name: "Master of Arts" },
  { code: "M.Com.", name: "Master of Commerce" },
  { code: "M.Sc.", name: "Master of Science" },
  { code: "MBA", name: "Master of Business Administration" },
  { code: "MCA", name: "Master of Computer Applications" },
  { code: "M.Tech.", name: "Master of Technology" },
  { code: "M.Ed.", name: "Master of Education" },
  { code: "LL.M.", name: "Master of Laws" },
  { code: "M.Arch.", name: "Master of Architecture" },
  { code: "M.Des.", name: "Master of Design" },
  { code: "M.Sc. Nursing", name: "Master of Science in Nursing" },
  { code: "M.Pharm.", name: "Master of Pharmacy" },
  { code: "MPT", name: "Master of Physiotherapy" },
  { code: "MHA", name: "Master of Hospital Administration" },
  { code: "MPH", name: "Master of Public Health" },
  { code: "MSW", name: "Master of Social Work" },
  { code: "MJMC", name: "Master of Journalism and Mass Communication" },
  { code: "MDS", name: "Master of Dental Surgery" },
  { code: "PGDM", name: "Post Graduate Diploma in Management" },
  { code: "MHRM", name: "Master of Human Resource Management" },
  { code: "Other", name: "Other" },
];

const PREF_CATEGORIES = [
  { key: "upsc", label: "Union Public Service Commission (UPSC)", options: ["Civil Services", "Forest Services", "UPSC Others"] },
  { key: "ssc", label: "Staff Selection Commission (SSC)", options: ["CGL", "CHSL", "SSC Others"] },
  { key: "banking", label: "Banking", options: ["IBPS Clerk", "IBPS Probationary Officer", "SBI Clerk", "SBI Probationary Officer", "Banking Others"] },
  { key: "railways", label: "Railways", options: ["NTPC", "Railways Others"] },
  { key: "tgpsc", label: "Telangana Public Service Commission (TGPSC)", options: ["TGPSC All Group Exams", "TGPSC CDPO/FRO", "TGPSC Other Dept.", "TGPSC Police Department", "TGPSC Others"] },
  { key: "appsc", label: "Andhra Pradesh Public Service Commission (APPSC)", options: ["APPSC All Group Exams", "APPSC CDPO/FRO", "APPSC Other Dept.", "APPSC Police Department", "APPSC Others"] },
];

const MAX_PREF = 3;

// ─── HELPER FUNCTIONS ────────────────────────────────────────────────────────

function toNull(v) {
  if (v === undefined || v === null) return null;
  if (typeof v === "string" && v.trim() === "") return null;
  return v;
}

function normalizeYesNo(v) {
  const s = String(v ?? "").trim().toLowerCase();
  return s === "yes" || s === "y" || v === true ? "yes" : "no";
}

function normalizePC(v) {
  const s = String(v ?? "").trim().toLowerCase();
  return s === "yes" || s === "y" ? "Yes" : "No";
}

function calcAge(dob) {
  if (!dob) return 0;
  return Math.abs(new Date(Date.now() - new Date(dob).getTime()).getUTCFullYear() - 1970);
}

function mapQualToBackend(q) {
  const map = {
    "below-10th": "below_10th",
    "10th": "10th",
    "12th": "intermediate",
    "iti": "iti",
    "polytechnic": "polytechnic",
    "graduation": "graduation",
    "double-graduation": "double_graduation",
    "postgraduation": "post_graduation",
    "double-postgraduation": "double_post_graduation",
    "phd": "phd",
    "other-edu": "other",
  };
  return map[q] || q;
}

function mapBackendToQ(level) {
  const s = String(level || "").toLowerCase().trim();
  const map = {
    "below_10th": "below-10th",
    "10th": "10th",
    "10thboard": "10th",
    "intermediate": "12th",
    "iti": "iti",
    "polytechnic": "polytechnic",
    "graduation": "graduation",
    "double_graduation": "double-graduation",
    "post_graduation": "postgraduation",
    "double_post_graduation": "double-postgraduation",
    "phd": "phd",
    "other": "other-edu",
    "below-10th": "below-10th",
    "12th": "12th",
    "double-graduation": "double-graduation",
    "postgraduation": "postgraduation",
    "double-postgraduation": "double-postgraduation",
    "other-edu": "other-edu",
  };
  return map[s] || "";
}

// ─── INITIAL STATES ───────────────────────────────────────────────────────────

const INIT_PERSONAL = {
  name: "",
  email: "",
  phone: "",
  gender: "",
  date_of_birth: "",
  state: "",
  stateCode: "",
  district: "",
  current_location: "",
  current_status: "",
  physically_challenged: "No",
  highest_education_institution_type: "",
  how_did_you_come_across_career_mitra: "",
  how_did_you_come_across_career_mitra_other: "",
  social_status: "",
  additional_support: "",
  notification_preference: "email",
  notify: true,
};

const INIT_EDU = {
  id: null,
  user_id: null,
  highest_qualification: "",
  // below 10th
  below10th_details: "",
  below10th_schoolname: "",
  // 10th
  tenth_board: "",
  tenth_schoolname: "",
  // intermediate
  intermediate_course: "",
  intermediate_course_other: "",
  intermediate_board: "",
  intermediate_vocational_subject: "",
  intermediate_college_name: "",
  intermediate_current_year: "",
  // iti
  iti_trade: "",
  iti_trade_other: "",
  iti_college_name: "",
  iti_current_year: "",
  // polytechnic
  polytechnic_branch: "",
  polytechnic_college_name: "",
  polytechnic_current_year: "",
  // graduation 1
  graduation_type: "",
  graduation_course: "",
  graduation_course_other: "",
  graduation_subject1: "",
  graduation_subject2: "",
  graduation_subject3: "",
  graduation_specialization: "",
  graduation_college_name: "",
  graduation_current_year: "",
  // graduation 2
  second_graduation_type: "",
  second_graduation_course: "",
  second_graduation_course_other: "",
  second_graduation_subject1: "",
  second_graduation_subject2: "",
  second_graduation_subject3: "",
  second_graduation_specialization: "",
  second_graduation_college_name: "",
  second_graduation_current_year: "",
  // PG 1
  post_graduation_course: "",
  post_graduation_course_other: "",
  post_graduation_specialization: "",
  pg_subject1: "",
  pg_subject2: "",
  pg_subject3: "",
  pg_college_name: "",
  pg_current_year: "",
  // PG 2
  second_post_graduation_course: "",
  second_post_graduation_course_other: "",
  second_post_graduation_specialization: "",
  second_pg_subject1: "",
  second_pg_subject2: "",
  second_pg_subject3: "",
  second_pg_college_name: "",
  second_pg_current_year: "",
  // phd
  phd_research_field: "",
  phd_university: "",
  phd_university_name: "",
  phd_current_year: "",
  // other
  other_course_code: "",
  other_course_specialization: "",
  other_course_full_name: "",
  other_education_full_name: "",
  other_education_current_year: "",
};

// ─── REUSABLE SMALL COMPONENTS ────────────────────────────────────────────────

function Label({ text, required }) {
  return (
    <label className="block text-sm font-semibold text-gray-700 mb-1">
      {text}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
}

function Input({ label, required, ...props }) {
  return (
    <div>
      {label && <Label text={label} required={required} />}
      <input
        className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400 transition-colors"
        {...props}
      />
    </div>
  );
}

function Select({ label, required, children, ...props }) {
  return (
    <div>
      {label && <Label text={label} required={required} />}
      <select
        className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-orange-400 transition-colors"
        {...props}
      >
        {children}
      </select>
    </div>
  );
}

function RadioGroup({ label, name, value, options, onChange }) {
  return (
    <div>
      <Label text={label} />
      <div className="flex gap-6 mt-1">
        {options.map((opt) => (
          <label key={opt} className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="radio"
              name={name}
              value={opt}
              checked={value === opt}
              onChange={onChange}
              className="accent-orange-500"
            />
            {opt}
          </label>
        ))}
      </div>
    </div>
  );
}

function EduBlock({ color, icon, title, children }) {
  // color: "blue" | "yellow" | "cyan" | "orange" | "green" | "indigo" | "gray"
  const borderMap = {
    blue: "border-blue-400 bg-blue-50",
    yellow: "border-yellow-400 bg-yellow-50",
    cyan: "border-cyan-400 bg-cyan-50",
    orange: "border-orange-400 bg-orange-50",
    green: "border-green-500 bg-green-50",
    indigo: "border-indigo-400 bg-indigo-50",
    gray: "border-gray-400 bg-gray-50",
  };
  return (
    <div className={`border-l-4 rounded-xl p-4 mb-4 ${borderMap[color] || borderMap.gray}`}>
      <p className="font-bold text-sm text-gray-800 mb-3">
        {icon} {title}
      </p>
      {children}
    </div>
  );
}

function CollegeYearRow({ eduState, setEduState, collegeKey, yearKey, showYear = true, placeholder = "College name and place" }) {
  return (
    <div className={`grid gap-3 mt-3 ${showYear ? "grid-cols-1 md:grid-cols-3" : "grid-cols-1"}`}>
      <div className={showYear ? "md:col-span-2" : ""}>
        <Input
          label="College / Institution Name"
          placeholder={placeholder}
          value={eduState[collegeKey] || ""}
          onChange={(e) => setEduState((prev) => ({ ...prev, [collegeKey]: e.target.value }))}
        />
      </div>
      {showYear && (
        <Select
          label="Current Academic Status"
          value={eduState[yearKey] || ""}
          onChange={(e) => setEduState((prev) => ({ ...prev, [yearKey]: e.target.value }))}
        >
          <option value="">Select Year</option>
          {CURRENT_YEAR_OPTIONS.map((y) => (
            <option key={y}>{y}</option>
          ))}
        </Select>
      )}
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function Userprofilefillingpage({ onClose }) {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // ── UI state
  const [profileData, setProfileData] = useState(null);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [prefOpen, setPrefOpen] = useState(false);
  const [prefPlacement, setPrefPlacement] = useState("bottom");
  const [prefMenuMaxHeight, setPrefMenuMaxHeight] = useState(320);
  const [showWelcomeModal, setShowWelcomeModal] = useState(
    () => !!(location?.state?.email)
  );
  const prefButtonRef = useRef(null);

  // ── Form state
  const [personal, setPersonal] = useState({
    ...INIT_PERSONAL,
    email: location?.state?.email || "",
  });
  const [edu, setEdu] = useState(INIT_EDU);

  // ── Extra state
  const [hasTechCert, setHasTechCert] = useState("no");
  const [techCertDetail, setTechCertDetail] = useState("");
  const [hasOtherCert, setHasOtherCert] = useState("no");
  const [otherCertDetail, setOtherCertDetail] = useState("");
  const [qualifiedTeacher, setQualifiedTeacher] = useState("");
  const [selectedPrefs, setSelectedPrefs] = useState([]);
  const [prefOtherInputs, setPrefOtherInputs] = useState({});
  const [alertSelection, setAlertSelection] = useState({ job: false, internship: false, both: true });

  // ── Location (country-state-city)
  const allStates = State.getStatesOfCountry("IN");
  const allCities = personal.stateCode ? City.getCitiesOfState("IN", personal.stateCode) : [];

  // ── Derived from edu
  const q = String(edu.highest_qualification || "").trim().toLowerCase();
  const isInterVoc = /voc/i.test(String(edu.intermediate_course || ""));

  const isGrad = ["graduation", "double-graduation", "postgraduation", "double-postgraduation", "phd"].includes(q);
  const isGrad2 = q === "double-graduation";
  const isPG = ["postgraduation", "double-postgraduation"].includes(q);
  const isPG2 = q === "double-postgraduation";
  const isPhd = q === "phd";
  const needsInter = q === "12th" || isGrad;

  // ── Prefs

  useEffect(() => {
    if (!prefOpen || !prefButtonRef.current) return;

    const rect = prefButtonRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const gap = 8;
    const minMenuHeight = 180;
    const maxMenuHeight = 380;
    const spaceBelow = viewportHeight - rect.bottom - gap;
    const spaceAbove = rect.top - gap;

    if (spaceBelow >= minMenuHeight || spaceBelow >= spaceAbove) {
      setPrefPlacement("bottom");
      setPrefMenuMaxHeight(Math.max(minMenuHeight, Math.min(maxMenuHeight, spaceBelow)));
    } else {
      setPrefPlacement("top");
      setPrefMenuMaxHeight(Math.max(minMenuHeight, Math.min(maxMenuHeight, spaceAbove)));
    }
  }, [prefOpen]);

  // ─── GET Profile ─────────────────────────────────────────────────────────

  useEffect(() => {
    if (!token) return;
    setIsLoading(true);
    axios
      .get(API_ENDPOINTS.USER_PROFILE, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        if (!isApiSuccess(res.data)) {
          toast.error(getApiMessage(res.data, "Error fetching profile"));
          return;
        }

        const payload = res.data?.data || {};
        const userData = payload?.user || payload || {};
        const educationData = payload?.education || userData?.education || {};
        const sportsData = payload?.sports || userData?.sports || null;

        const api = {
          ...userData,
          education: educationData,
          sports: sportsData,
        };

        setProfileData(api);
        const ed = educationData || {};

        // Find stateCode from state name
        const foundState = allStates.find((s) => s.name === api.state);
        const stateCode = foundState ? foundState.isoCode : "";

        setPersonal({
          name: api.name || "",
          email: api.email || "",
          phone: api.phone || "",
          gender: api.gender || "",
          date_of_birth: api.date_of_birth || "",
          state: api.state || "",
          stateCode: stateCode,
          district: api.district || "",
          current_location: api.current_location || "",
          current_status: api.current_status || "",
          physically_challenged: normalizePC(api.physically_challenged),
          highest_education_institution_type: api.highest_education_institution_type || "",
          how_did_you_come_across_career_mitra: api.how_did_you_come_across_career_mitra || "",
          how_did_you_come_across_career_mitra_other: "",
          social_status: api.social_status || "",
          additional_support: api.additional_support || "",
          notification_preference: api.notification_preference || "email",
          notify: api.notify ?? true,
        });

        setAlertSelection({
          job: !!api.alert_job && !api.alert_both,
          internship: !!api.alert_internship && !api.alert_both,
          both: !!api.alert_both || (!api.alert_job && !api.alert_internship),
        });

        setHasTechCert(normalizeYesNo(api.has_technical_certification));
        setTechCertDetail(api.technical_certification_details || "");

        if (api.any_other_certification_from_board_of_education) {
          setHasOtherCert("yes");
          setOtherCertDetail(api.any_other_certification_from_board_of_education);
        }

        const te = String(
          api.qualified_teacher_exam || api.graduation_qualified_in ||
          ed?.graduation?.qualified_in || ed?.graduation_qualified_in || ""
        ).trim();
        setQualifiedTeacher(te);

        if (Array.isArray(api.preferences)) setSelectedPrefs(api.preferences.filter(Boolean));

        if (ed && typeof ed === "object") {
          const first = (...vals) => vals.find((v) => v !== undefined && v !== null) ?? "";
          const gradSubjects = Array.isArray(ed?.graduation?.subjects)
            ? ed.graduation.subjects
            : [ed?.graduation_subject1, ed?.graduation_subject2, ed?.graduation_subject3];
          const secondGradSubjects = Array.isArray(ed?.second_graduation?.subjects)
            ? ed.second_graduation.subjects
            : [ed?.second_graduation_subject1, ed?.second_graduation_subject2, ed?.second_graduation_subject3];
          const pgSubjects = Array.isArray(ed?.post_graduation?.subjects)
            ? ed.post_graduation.subjects
            : [ed?.pg_subject1, ed?.pg_subject2, ed?.pg_subject3];
          const secondPgSubjects = Array.isArray(ed?.second_post_graduation?.subjects)
            ? ed.second_post_graduation.subjects
            : [ed?.second_pg_subject1, ed?.second_pg_subject2, ed?.second_pg_subject3];

          setEdu({
            id: ed.id || null,
            user_id: ed.user_id || null,
            highest_qualification: mapBackendToQ(ed.qualification_level || ""),
            below10th_details: first(ed.below10th?.details, ed.below10th_details),
            below10th_schoolname: first(ed.below10th?.school_name, ed.below10th_schoolname),
            tenth_board: first(ed.tenth?.board, ed["10th_board"], ed.tenth_board),
            tenth_schoolname: first(ed.tenth?.school_name, ed["10th_schoolname"], ed.tenth_schoolname),
            intermediate_course: first(ed.intermediate?.course, ed.intermediate_course),
            intermediate_course_other: first(ed.intermediate?.course_other, ed.intermediate_course_other),
            intermediate_board: first(ed.intermediate?.board, ed.intermediate_board),
            intermediate_vocational_subject: first(ed.intermediate?.vocational_subject, ed.intermediate_vocational_subject),
            intermediate_college_name: first(ed.intermediate?.college_name, ed.intermediate_college_name),
            intermediate_current_year: first(ed.intermediate?.current_year, ed.intermediate_current_year),
            iti_trade: first(ed.iti?.trade, ed.iti_trade),
            iti_trade_other: first(ed.iti?.trade_other, ed.iti_trade_other),
            iti_college_name: first(ed.iti?.college_name, ed.iti_college_name),
            iti_current_year: first(ed.iti?.current_year, ed.iti_current_year),
            polytechnic_branch: first(ed.polytechnic?.branch, ed.polytechnic_branch),
            polytechnic_college_name: first(ed.polytechnic?.college_name, ed.polytechnic_college_name),
            polytechnic_current_year: first(ed.polytechnic?.current_year, ed.polytechnic_current_year),
            graduation_type: first(ed.graduation?.type, ed.graduation_type),
            graduation_course: first(ed.graduation?.course, ed.graduation_course),
            graduation_course_other: first(ed.graduation?.course_other, ed.graduation_course_other),
            graduation_subject1: first(gradSubjects[0], ed.graduation_subject1),
            graduation_subject2: first(gradSubjects[1], ed.graduation_subject2),
            graduation_subject3: first(gradSubjects[2], ed.graduation_subject3),
            graduation_specialization: first(ed.graduation?.specialization, ed.graduation_specialization),
            graduation_college_name: first(ed.graduation?.college_name, ed.graduation_college_name),
            graduation_current_year: first(ed.graduation?.current_year, ed.graduation_current_year),
            second_graduation_type: first(ed.second_graduation?.type, ed.second_graduation_type),
            second_graduation_course: first(ed.second_graduation?.course, ed.second_graduation_course),
            second_graduation_course_other: first(ed.second_graduation?.course_other, ed.second_graduation_course_other),
            second_graduation_subject1: first(secondGradSubjects[0], ed.second_graduation_subject1),
            second_graduation_subject2: first(secondGradSubjects[1], ed.second_graduation_subject2),
            second_graduation_subject3: first(secondGradSubjects[2], ed.second_graduation_subject3),
            second_graduation_specialization: first(ed.second_graduation?.specialization, ed.second_graduation_specialization),
            second_graduation_college_name: first(ed.second_graduation?.college_name, ed.second_graduation_college_name),
            second_graduation_current_year: first(ed.second_graduation?.current_year, ed.second_graduation_current_year),
            post_graduation_course: first(ed.post_graduation?.course, ed.post_graduation_course),
            post_graduation_course_other: first(ed.post_graduation?.course_other, ed.post_graduation_course_other),
            post_graduation_specialization: first(ed.post_graduation?.specialization, ed.post_graduation_specialization),
            pg_subject1: first(pgSubjects[0], ed.pg_subject1),
            pg_subject2: first(pgSubjects[1], ed.pg_subject2),
            pg_subject3: first(pgSubjects[2], ed.pg_subject3),
            pg_college_name: first(ed.post_graduation?.college_name, ed.pg_college_name),
            pg_current_year: first(ed.post_graduation?.current_year, ed.pg_current_year),
            second_post_graduation_course: first(ed.second_post_graduation?.course, ed.second_post_graduation_course),
            second_post_graduation_course_other: first(ed.second_post_graduation?.course_other, ed.second_post_graduation_course_other),
            second_post_graduation_specialization: first(ed.second_post_graduation?.specialization, ed.second_post_graduation_specialization),
            second_pg_subject1: first(secondPgSubjects[0], ed.second_pg_subject1),
            second_pg_subject2: first(secondPgSubjects[1], ed.second_pg_subject2),
            second_pg_subject3: first(secondPgSubjects[2], ed.second_pg_subject3),
            second_pg_college_name: first(ed.second_post_graduation?.college_name, ed.second_pg_college_name),
            second_pg_current_year: first(ed.second_post_graduation?.current_year, ed.second_pg_current_year),
            phd_research_field: first(ed.phd?.research_field, ed.phd_research_field),
            phd_university: first(ed.phd?.university, ed.phd_university),
            phd_university_name: first(ed.phd?.university_name, ed.phd_university_name),
            phd_current_year: first(ed.phd?.current_year, ed.phd_current_year),
            other_course_code: first(ed.other?.course_code, ed.other_course_code),
            other_course_specialization: first(ed.other?.specialization, ed.other_course_specialization),
            other_course_full_name: first(ed.other?.course_full_name, ed.other_course_full_name),
            other_education_full_name: first(ed.other?.education_full_name, ed.other_education_full_name),
            other_education_current_year: first(ed.other?.current_year, ed.other_education_current_year),
          });
        }
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || "Error fetching profile");
        console.error(err);
      })
      .finally(() => setIsLoading(false));
  }, [token]);

  // ─── Personal handlers ────────────────────────────────────────────────────

  function handlePersonalChange(e) {
    const { name, value, type, checked } = e.target;
    setPersonal((prev) => {
      const updated = { ...prev, [name]: type === "checkbox" ? checked : value };
      if (name === "how_did_you_come_across_career_mitra" && value !== "Other") {
        updated.how_did_you_come_across_career_mitra_other = "";
      }
      return updated;
    });
  }

  function handleStateChange(e) {
    const isoCode = e.target.value;
    const found = allStates.find((s) => s.isoCode === isoCode);
    setPersonal((prev) => ({
      ...prev,
      stateCode: isoCode,
      state: found ? found.name : "",
      district: "",
    }));
  }

  function handleCityChange(e) {
    setPersonal((prev) => ({ ...prev, district: e.target.value }));
  }

  // ─── Edu handlers ─────────────────────────────────────────────────────────

  function handleEduChange(e) {
    const { name, value } = e.target;
    setEdu((prev) => ({ ...prev, [name]: value }));
  }

  // ─── Pref handlers ────────────────────────────────────────────────────────

  function togglePref(opt) {
    setSelectedPrefs((prev) => {
      if (prev.includes(opt)) return prev.filter((p) => p !== opt);
      if (prev.length >= MAX_PREF) return prev;
      return [...prev, opt];
    });
  }

  // ─── Validation ───────────────────────────────────────────────────────────

  function validateStep1() {
    const { name, phone, gender, date_of_birth, state, district, current_location, current_status } = personal;
    if (!name || !phone || !gender || !date_of_birth || !state || !district || !current_location || !current_status) {
      toast.error("Please fill all required fields");
      return false;
    }
    if (calcAge(date_of_birth) < 18) {
      toast.error("You must be at least 18 years old");
      return false;
    }
    return true;
  }

  function goNext() {
    if (step === 1 && !validateStep1()) return;
    setStep((p) => p + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goPrev() {
    setStep((p) => p - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ─── Build payload ────────────────────────────────────────────────────────

  function buildPayload() {
    const backendQ = mapQualToBackend(q);
    const existingSports = profileData?.sports || {};

    const profilePayload = {
      name: toNull(personal.name),
      email: toNull(personal.email),
      phone: toNull(personal.phone),
      gender: toNull(personal.gender?.toLowerCase()),
      date_of_birth: toNull(personal.date_of_birth),
      state: toNull(personal.state),
      district: toNull(personal.district),
      current_location: toNull(personal.current_location),
      current_status: toNull(personal.current_status),
      physically_challenged: normalizePC(personal.physically_challenged),
      highest_education_institution_type: toNull(personal.highest_education_institution_type),
      social_status: toNull(personal.social_status),
      additional_support: toNull(personal.additional_support),
      how_did_you_come_across_career_mitra: toNull(personal.how_did_you_come_across_career_mitra),
      how_did_you_come_across_career_mitra_other:
        personal.how_did_you_come_across_career_mitra === "Other"
          ? toNull(personal.how_did_you_come_across_career_mitra_other)
          : null,
      alert_job: !!(alertSelection.job || alertSelection.both),
      alert_internship: !!(alertSelection.internship || alertSelection.both),
      alert_both: !!alertSelection.both,
      notification_preference: toNull(personal.notification_preference || "email"),
      notify: personal.notify ?? true,
      job_type: toNull(profileData?.job_type || "permanent"),
      interest: toNull(profileData?.interest || user?.interest || "Govt Jobs"),
      has_technical_certification: normalizeYesNo(hasTechCert),
      technical_certification_details:
        normalizeYesNo(hasTechCert) === "yes" ? toNull(techCertDetail) : null,
      any_other_certification_from_board_of_education:
        normalizeYesNo(hasOtherCert) === "yes" ? toNull(otherCertDetail) : null,
      qualified_teacher_exam: !!(qualifiedTeacher || "").trim(),
      preferences: selectedPrefs.map((p) =>
        p.toLowerCase().includes("other") ? prefOtherInputs[p] || p : p
      ),
    };

    const educationPayload = {
      qualification_level: backendQ,
      below10th_details: q === "below-10th" ? toNull(edu.below10th_details) : null,
      below10th_schoolname: q === "below-10th" ? toNull(edu.below10th_schoolname) : null,
      "10th_board": q === "10th" ? toNull(edu.tenth_board) : null,
      "10th_schoolname": q === "10th" ? toNull(edu.tenth_schoolname) : null,
      intermediate_course: needsInter ? toNull(edu.intermediate_course) : null,
      intermediate_course_other:
        needsInter && edu.intermediate_course === "Other" ? toNull(edu.intermediate_course_other) : null,
      intermediate_board: needsInter ? toNull(edu.intermediate_board) : null,
      intermediate_vocational_subject:
        needsInter && isInterVoc ? toNull(edu.intermediate_vocational_subject) : null,
      intermediate_college_name: needsInter ? toNull(edu.intermediate_college_name) : null,
      intermediate_current_year: needsInter ? toNull(edu.intermediate_current_year) : null,
      iti_trade: q === "iti" ? toNull(edu.iti_trade) : null,
      iti_trade_other: q === "iti" && edu.iti_trade === "Other" ? toNull(edu.iti_trade_other) : null,
      iti_college_name: q === "iti" ? toNull(edu.iti_college_name) : null,
      iti_current_year: q === "iti" ? toNull(edu.iti_current_year) : null,
      polytechnic_branch: q === "polytechnic" ? toNull(edu.polytechnic_branch) : null,
      polytechnic_college_name: q === "polytechnic" ? toNull(edu.polytechnic_college_name) : null,
      polytechnic_current_year: q === "polytechnic" ? toNull(edu.polytechnic_current_year) : null,
      diploma_branch: null,
      diploma_current_year: null,
      graduation_type: isGrad ? toNull(edu.graduation_type) : null,
      graduation_course: isGrad ? toNull(edu.graduation_course) : null,
      graduation_course_other:
        isGrad && edu.graduation_course === "Other" ? toNull(edu.graduation_course_other) : null,
      graduation_subject1: isGrad ? toNull(edu.graduation_subject1) : null,
      graduation_subject2: isGrad ? toNull(edu.graduation_subject2) : null,
      graduation_subject3: isGrad ? toNull(edu.graduation_subject3) : null,
      graduation_specialization: isGrad ? toNull(edu.graduation_specialization) : null,
      graduation_college_name: isGrad ? toNull(edu.graduation_college_name) : null,
      graduation_current_year: isGrad ? toNull(edu.graduation_current_year) : null,
      graduation_qualified_in:
        isGrad && qualifiedTeacher && qualifiedTeacher !== "true" ? toNull(qualifiedTeacher) : null,
      qualified_teacher_exam: isGrad ? (qualifiedTeacher ? 1 : 0) : null,
      second_graduation_type: isGrad2 ? toNull(edu.second_graduation_type) : null,
      second_graduation_course: isGrad2 ? toNull(edu.second_graduation_course) : null,
      second_graduation_course_other:
        isGrad2 && edu.second_graduation_course === "Other"
          ? toNull(edu.second_graduation_course_other)
          : null,
      second_graduation_subject1: isGrad2 ? toNull(edu.second_graduation_subject1) : null,
      second_graduation_subject2: isGrad2 ? toNull(edu.second_graduation_subject2) : null,
      second_graduation_subject3: isGrad2 ? toNull(edu.second_graduation_subject3) : null,
      second_graduation_specialization: isGrad2 ? toNull(edu.second_graduation_specialization) : null,
      second_graduation_college_name: isGrad2 ? toNull(edu.second_graduation_college_name) : null,
      second_graduation_current_year: isGrad2 ? toNull(edu.second_graduation_current_year) : null,
      second_graduation_qualified_in: null,
      post_graduation_course: isPG ? toNull(edu.post_graduation_course) : null,
      post_graduation_course_other:
        isPG && edu.post_graduation_course === "Other" ? toNull(edu.post_graduation_course_other) : null,
      post_graduation_specialization: isPG ? toNull(edu.post_graduation_specialization) : null,
      pg_subject1: isPG ? toNull(edu.pg_subject1) : null,
      pg_subject2: isPG ? toNull(edu.pg_subject2) : null,
      pg_subject3: isPG ? toNull(edu.pg_subject3) : null,
      pg_college_name: isPG ? toNull(edu.pg_college_name) : null,
      pg_current_year: isPG ? toNull(edu.pg_current_year) : null,
      second_post_graduation_course: isPG2 ? toNull(edu.second_post_graduation_course) : null,
      second_post_graduation_course_other:
        isPG2 && edu.second_post_graduation_course === "Other"
          ? toNull(edu.second_post_graduation_course_other)
          : null,
      second_post_graduation_specialization: isPG2
        ? toNull(edu.second_post_graduation_specialization)
        : null,
      second_pg_subject1: isPG2 ? toNull(edu.second_pg_subject1) : null,
      second_pg_subject2: isPG2 ? toNull(edu.second_pg_subject2) : null,
      second_pg_subject3: isPG2 ? toNull(edu.second_pg_subject3) : null,
      second_pg_college_name: isPG2 ? toNull(edu.second_pg_college_name) : null,
      second_pg_current_year: isPG2 ? toNull(edu.second_pg_current_year) : null,
      phd_research_field: isPhd ? toNull(edu.phd_research_field) : null,
      phd_university: isPhd ? toNull(edu.phd_university) : null,
      phd_university_name: isPhd ? toNull(edu.phd_university_name) : null,
      phd_current_year: isPhd ? toNull(edu.phd_current_year) : null,
      other_course_code: q === "other-edu" ? toNull(edu.other_course_code) : null,
      other_course_specialization: q === "other-edu" ? toNull(edu.other_course_specialization) : null,
      other_course_full_name: q === "other-edu" ? toNull(edu.other_course_full_name) : null,
      other_education_full_name: q === "other-edu" ? toNull(edu.other_education_full_name) : null,
      other_education_current_year: q === "other-edu" ? toNull(edu.other_education_current_year) : null,
    };

    const sportsPayload = {
      isSportsPerson: Boolean(existingSports?.isSportsPerson),
      sportName: toNull(existingSports?.sportName),
      otherSportName: toNull(existingSports?.otherSportName),
      participationLevel: toNull(existingSports?.participationLevel),
      otherParticipationLevel: toNull(existingSports?.otherParticipationLevel),
      achievementType: toNull(existingSports?.achievementType),
      otherAchievementType: toNull(existingSports?.otherAchievementType),
      participationYear: existingSports?.participationYear ?? null,
      sportsQuotaEligible: Boolean(existingSports?.sportsQuotaEligible),
    };

    return { profile: profilePayload, education: educationPayload, sports: sportsPayload };
  }

  // ─── Submit ───────────────────────────────────────────────────────────────

  async function handleSubmit(e) {
    e.preventDefault();
    if (step === 1 && !validateStep1()) return;

    const payload = buildPayload();
    console.log("POST Payload:", JSON.stringify(payload, null, 2));

    try {
      const res = await axios.put(API_ENDPOINTS.USER_PROFILE, payload, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });

      if (isApiSuccess(res.data)) {
        toast.success("Profile created successfully! Redirecting to Student Dashboard...");
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
        if (onClose) onClose();
        setTimeout(() => navigate("/user-dashboard"), 3200);
      } else {
        toast.error(getApiMessage(res.data, "Save failed"));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Save error");
      console.error(err);
    }
  }

  // ─── Render Intermediate Block ────────────────────────────────────────────

  function renderIntermediateBlock() {
    return (
      <EduBlock color="blue" icon="📚" title="Intermediate / 12th Details">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Select
            label="Intermediate Course"
            required
            name="intermediate_course"
            value={edu.intermediate_course}
            onChange={handleEduChange}
          >
            <option value="">Select Course</option>
            {INTERMEDIATE_COURSES.map((c) => (
              <option key={c.code} value={c.code}>{c.code} — {c.name}</option>
            ))}
          </Select>

          {edu.intermediate_course === "Other" && (
            <Input
              label="Specify Course"
              name="intermediate_course_other"
              value={edu.intermediate_course_other}
              onChange={handleEduChange}
              placeholder="Enter course name"
            />
          )}

          <Input
            label="Intermediate Board"
            name="intermediate_board"
            value={edu.intermediate_board}
            onChange={handleEduChange}
            placeholder="e.g. Telangana State Board / CBSE"
          />

          {isInterVoc && (
            <Input
              label="Vocational Subject"
              name="intermediate_vocational_subject"
              value={edu.intermediate_vocational_subject}
              onChange={handleEduChange}
              placeholder="e.g. COPA, Electrical"
            />
          )}
        </div>
        <CollegeYearRow
          eduState={edu}
          setEduState={setEdu}
          collegeKey="intermediate_college_name"
          yearKey="intermediate_current_year"
          showYear={false}
          placeholder="e.g. Sri Chaitanya Junior College, Hyderabad"
        />
      </EduBlock>
    );
  }

  // ─── Render Graduation Block ──────────────────────────────────────────────

  function renderGraduationBlock(num) {
    const isSecond = num === 2;
    const typeKey = isSecond ? "second_graduation_type" : "graduation_type";
    const courseKey = isSecond ? "second_graduation_course" : "graduation_course";
    const courseOtherKey = isSecond ? "second_graduation_course_other" : "graduation_course_other";
    const specKey = isSecond ? "second_graduation_specialization" : "graduation_specialization";
    const s1 = isSecond ? "second_graduation_subject1" : "graduation_subject1";
    const s2 = isSecond ? "second_graduation_subject2" : "graduation_subject2";
    const s3 = isSecond ? "second_graduation_subject3" : "graduation_subject3";
    const collegeKey = isSecond ? "second_graduation_college_name" : "graduation_college_name";
    const yearKey = isSecond ? "second_graduation_current_year" : "graduation_current_year";

    const typeVal = edu[typeKey];
    const courseVal = edu[courseKey];
    const courseList = typeVal === "professional" ? PROFESSIONAL_GRADUATION : REGULAR_GRADUATION;
    const isRegular = typeVal === "regular";
    const isProfessional = typeVal === "professional";

    return (
      <EduBlock color="orange" icon="🎓" title={`Graduation ${isSecond ? "2" : "1"} Details`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Select label="Graduation Type" required name={typeKey} value={typeVal} onChange={handleEduChange}>
            <option value="">Select Type</option>
            <option value="regular">Regular Graduation</option>
            <option value="professional">Professional Graduation</option>
          </Select>

          {typeVal && (
            <Select label="Course" required name={courseKey} value={courseVal} onChange={handleEduChange}>
              <option value="">Select Course</option>
              {courseList.map((c) => (
                <option key={c.code} value={c.code}>{c.code} — {c.name}</option>
              ))}
            </Select>
          )}

          {courseVal === "Other" && (
            <div className="md:col-span-2">
              <Input
                label="Specify Course Name"
                name={courseOtherKey}
                value={edu[courseOtherKey]}
                onChange={handleEduChange}
                placeholder="Enter course name"
              />
            </div>
          )}

          {courseVal && isRegular && (
            <>
              <Input label="Subject 1" name={s1} value={edu[s1]} onChange={handleEduChange} placeholder="Subject 1" />
              <Input label="Subject 2" name={s2} value={edu[s2]} onChange={handleEduChange} placeholder="Subject 2" />
              <Input label="Subject 3" name={s3} value={edu[s3]} onChange={handleEduChange} placeholder="Subject 3" />
            </>
          )}

          {courseVal && isProfessional && (
            <Input
              label="Specialization"
              name={specKey}
              value={edu[specKey]}
              onChange={handleEduChange}
              placeholder="Enter specialization"
            />
          )}

          {/* Teacher exam — only for first graduation B.Ed. */}
          {!isSecond && courseVal === "B.Ed." && (
            <div className="md:col-span-2">
              <RadioGroup
                label="Are you qualified in Teacher Exam?"
                name="qualified_teacher_radio"
                value={qualifiedTeacher ? "yes" : "no"}
                options={["yes", "no"]}
                onChange={(e) => setQualifiedTeacher(e.target.value === "yes" ? "true" : "")}
              />

              {qualifiedTeacher && (
                <div className="mt-3">
                  <Label text="Select which exams you qualified in:" />
                  <div className="flex gap-4 flex-wrap mt-1">
                    {["TGTET", "APTET", "CTET"].map((exam) => {
                      const exams = qualifiedTeacher.split(",").map((s) => s.trim()).filter((e) => e && e !== "true");
                      const isSelected = exams.includes(exam);
                      const isDisabled = exams.length > 0 && !isSelected;
                      return (
                        <label key={exam} className={`flex items-center gap-2 text-sm cursor-pointer ${isDisabled ? "opacity-40" : ""}`}>
                          <input
                            type="checkbox"
                            className="accent-orange-500"
                            checked={isSelected}
                            disabled={isDisabled}
                            onChange={() =>
                              setQualifiedTeacher(isSelected ? "true" : exam)
                            }
                          />
                          {exam}
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <CollegeYearRow
          eduState={edu}
          setEduState={setEdu}
          collegeKey={collegeKey}
          yearKey={yearKey}
          placeholder="e.g. Osmania University, Hyderabad"
        />
      </EduBlock>
    );
  }

  // ─── Render PG Block ──────────────────────────────────────────────────────

  function renderPGBlock(num) {
    const isSecond = num === 2;
    const courseKey = isSecond ? "second_post_graduation_course" : "post_graduation_course";
    const courseOtherKey = isSecond ? "second_post_graduation_course_other" : "post_graduation_course_other";
    const specKey = isSecond ? "second_post_graduation_specialization" : "post_graduation_specialization";
    const s1 = isSecond ? "second_pg_subject1" : "pg_subject1";
    const s2 = isSecond ? "second_pg_subject2" : "pg_subject2";
    const s3 = isSecond ? "second_pg_subject3" : "pg_subject3";
    const collegeKey = isSecond ? "second_pg_college_name" : "pg_college_name";
    const yearKey = isSecond ? "second_pg_current_year" : "pg_current_year";

    return (
      <EduBlock color="green" icon="🎯" title={`Post Graduation ${isSecond ? "2" : "1"} Details`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Select label="PG Course" required name={courseKey} value={edu[courseKey]} onChange={handleEduChange}>
            <option value="">Select Course</option>
            {POST_GRADUATION.map((c) => (
              <option key={c.code} value={c.code}>{c.code} — {c.name}</option>
            ))}
          </Select>

          {edu[courseKey] === "Other" && (
            <Input
              label="Specify Course"
              name={courseOtherKey}
              value={edu[courseOtherKey]}
              onChange={handleEduChange}
              placeholder="Enter PG course name"
            />
          )}

          <Input
            label="Specialization"
            name={specKey}
            value={edu[specKey]}
            onChange={handleEduChange}
            placeholder="Enter specialization"
          />

          <Input label="Subject 1" name={s1} value={edu[s1]} onChange={handleEduChange} placeholder="Subject 1" />
          <Input label="Subject 2" name={s2} value={edu[s2]} onChange={handleEduChange} placeholder="Subject 2" />
          <Input label="Subject 3" name={s3} value={edu[s3]} onChange={handleEduChange} placeholder="Subject 3" />
        </div>
        <CollegeYearRow
          eduState={edu}
          setEduState={setEdu}
          collegeKey={collegeKey}
          yearKey={yearKey}
          placeholder="e.g. Osmania University, Hyderabad"
        />
      </EduBlock>
    );
  }

  // ─── Render Preferences ───────────────────────────────────────────────────

  function renderPreferences() {
    const maxReached = selectedPrefs.length >= MAX_PREF;

    return (
      <div className="relative">
        <button
          ref={prefButtonRef}
          type="button"
          onClick={() => setPrefOpen((p) => !p)}
          className="w-full flex justify-between items-center border-2 border-gray-200 rounded-lg px-3 py-2 text-sm bg-white hover:border-orange-400 transition-colors"
        >
          <span className="text-gray-700">
            {selectedPrefs.length > 0
              ? `${selectedPrefs.length} Preference${selectedPrefs.length > 1 ? "s" : ""} Selected`
              : "Select Exam Preferences"}
          </span>
          <span>{prefOpen ? "▲" : "▼"}</span>
        </button>

        {prefOpen && (
          <div
            className={`absolute z-50 left-0 right-0 bg-white border-2 border-gray-200 rounded-xl shadow-xl overflow-y-auto p-3 ${
              prefPlacement === "bottom" ? "top-full mt-1" : "bottom-full mb-1"
            }`}
            style={{ maxHeight: `${prefMenuMaxHeight}px` }}
          >
            <p className="text-xs text-gray-500 bg-amber-50 border border-amber-200 rounded px-2 py-1 mb-3">
              Select up to <strong>{MAX_PREF} preferences</strong>. Selected: <strong>{selectedPrefs.length}</strong>
            </p>
            {PREF_CATEGORIES.map((cat) => {
              return (
                <div key={cat.key} className="mb-3">
                  <p className="text-xs font-bold text-orange-500 uppercase tracking-wide mb-1">{cat.label}</p>
                  <div className="flex flex-wrap gap-2">
                    {cat.options.map((opt) => {
                      const checked = selectedPrefs.includes(opt);
                      return (
                        <div key={opt}>
                          <label
                            className={`flex items-center gap-1.5 px-3 py-1 border-2 rounded-full text-xs cursor-pointer transition-all ${
                              checked
                                ? "border-orange-400 bg-orange-50 text-orange-600 font-semibold"
                                : "border-gray-200 bg-gray-50 text-gray-600"
                            }`}
                          >
                            <input
                              type="checkbox"
                              className="accent-orange-500"
                              checked={checked}
                              disabled={!checked && maxReached}
                              onChange={() => togglePref(opt)}
                            />
                            {opt}
                          </label>
                          {opt.toLowerCase().includes("other") && checked && (
                            <input
                              type="text"
                              className="mt-1 ml-4 border-2 border-gray-200 rounded px-2 py-1 text-xs w-40 focus:outline-none focus:border-orange-400"
                              placeholder="Please specify"
                              value={prefOtherInputs[opt] || ""}
                              onChange={(e) =>
                                setPrefOtherInputs((prev) => ({ ...prev, [opt]: e.target.value }))
                              }
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {selectedPrefs.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {selectedPrefs.map((p) => (
              <span
                key={p}
                onClick={() => setSelectedPrefs((prev) => prev.filter((x) => x !== p))}
                className="flex items-center gap-1 px-3 py-1 bg-orange-400 text-white rounded-full text-xs font-semibold cursor-pointer hover:bg-orange-500"
              >
                {p} <span>✕</span>
              </span>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ─── Edu note map ─────────────────────────────────────────────────────────

  const eduNoteMap = {
    "below-10th": "Below 10th Standard",
    "10th": "10th / SSC — please fill school details",
    "12th": "Intermediate / 12th",
    "iti": "ITI Trade Details",
    "polytechnic": "Polytechnic Diploma",
    "graduation": "Intermediate → Graduation",
    "double-graduation": "Intermediate → Graduation 1 → Graduation 2",
    "postgraduation": "Intermediate → Graduation → Post Graduation",
    "double-postgraduation": "Intermediate → Graduation → PG 1 → PG 2",
    "phd": "Intermediate → Graduation → PhD",
    "other-edu": "Other / Miscellaneous Education",
  };

  // ─── JSX ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-100 py-20 pb-16">

      {/* ── Welcome Modal ── */}
      {/* {showWelcomeModal && (
        <div className="absolute bottom-30 right-0  z-50 flex items-center justify-center p-4">
        
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 flex flex-col items-center text-center animate-[fadeInUp_0.3s_ease]">
            <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center mb-5 shadow-inner">
              <span className="text-4xl animate-bounce"> 😒</span>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Your Profie is Incomplete!
            </h2>

            <p className="text-gray-500 text-base leading-relaxed mb-2">
              Fill your profile details and unlock{" "}
              <span className="text-orange-500 font-semibold">personalised job alerts </span>{" "}
              tailored just for you in your dashboard.
            </p>

            <p className="text-gray-400 text-sm mb-8">
              It only takes a few minutes — let's get started!
            </p>

       
            <div className="flex gap-3 w-full">
              <Link to="/"
                onClick={() => setShowWelcomeModal(false)}
              
                className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-500 font-semibold hover:bg-gray-50 transition"
              >
                Later
              </Link>
              <button
                onClick={() => setShowWelcomeModal(false)}
                className="flex-1 py-3 rounded-xl bg-orange-500 text-white font-semibold hover:bg-orange-600 transition shadow-lg shadow-orange-200"
              >
                Okey..
              </button>
            </div>
          </div>
        </div>
      )} */}

      {/* Confetti */}
        <SEO
        title="User Profile Filling | Career Mitra"
        description="Complete your user profile to get personalized job alerts and access exclusive career resources."
        keywords="user profile, job alerts, career resources, personalized dashboard"
        url="https://www.careermitra.in/user-profile-filling"
      />
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={500}
          gravity={0.3}
        />
      )}

      <div className="max-w-3xl mx-auto px-4">

        {/* ── Step Progress ── */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {/* Step 1 */}
          <div className="flex items-center gap-2">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                step > 1
                  ? "bg-green-500 border-green-500 text-white"
                  : step === 1
                  ? "bg-orange-500 border-orange-500 text-white"
                  : "border-gray-300 text-gray-400"
              }`}
            >
              {step > 1 ? "✓" : "1"}
            </div>
            <span className={`text-sm font-semibold ${step === 1 ? "text-orange-500" : "text-gray-400"}`}>
              Personal
            </span>
          </div>

          {/* Connector */}
          <div className={`w-14 h-0.5 ${step > 1 ? "bg-green-400" : "bg-gray-200"}`} />

          {/* Step 2 */}
          <div className="flex items-center gap-2">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                step === 2
                  ? "bg-orange-500 border-orange-500 text-white"
                  : "border-gray-300 text-gray-400"
              }`}
            >
              2
            </div>
            <span className={`text-sm font-semibold ${step === 2 ? "text-orange-500" : "text-gray-400"}`}>
              Education & Preferences
            </span>
          </div>
        </div>

        {/* ── Card ── */}
        <div className="bg-white rounded-2xl shadow-xl overflow-visible">

          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-amber-400 px-6 py-4 text-center">
           <h2 className="text-white text-lg font-extrabold tracking-wide">
              CAREER MITRA — Your Gateway to Government Opportunities
            </h2>
            <div className=" mx-auto bg-white/20 border border-gray-100 shadow-md rounded-2xl p-5 py-2">
  
  <p className="text-sm text-gray-700 leading-relaxed">
    <span className="block font-semibold text-orange-500 mb-1">
      Profile progress
    </span>

    Your profile is 
    <span className="font-semibold text-green-600"> {calculateProfileCompletion(profileData)}% complete</span>. 
    Please complete your personal and educational details to continue.

    <span className="block mt-4 w-full h-2 bg-gray-200 rounded-full overflow-hidden">
      <span
        className="block h-full bg-green-500 rounded-full transition-all duration-500"
        style={{ width: `${calculateProfileCompletion(profileData)}%` }}
      ></span>
    </span>
  </p>

</div>
           
          </div>

          {/* Body */}
          <div className="p-6">
            {isLoading ? (
              <div className="flex flex-col items-center py-16 text-gray-400">
                <div className="w-10 h-10 border-4 border-orange-100 border-t-orange-400 rounded-full animate-spin mb-3" />
                <p className="text-sm">Loading your profile...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>

                {/* ════════════════ STEP 1 ════════════════ */}
                {step === 1 && (
                  <div>
                    <p className="text-base font-bold text-orange-500 border-b-2 border-orange-100 pb-2 mb-5">
                      👤 Personal Details
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                      {/* Full Name */}
                      <Input
                        label="Full Name"
                        required
                        name="name"
                        value={personal.name}
                        onChange={handlePersonalChange}
                        placeholder="Enter your full name"
                      />

                      {/* Email (disabled) */}
                      <div>
                        <Label text="Email" />
                        <input
                          type="email"
                          name="email"
                          value={personal.email}
                          disabled
                          className="w-full border-2 border-gray-100 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
                        />
                      </div>

                      {/* Phone */}
                      <Input
                        label="Phone Number"
                        required
                        type="tel"
                        name="phone"
                        value={personal.phone}
                        onChange={handlePersonalChange}
                        placeholder="10-digit mobile number"
                      />

                      {/* Gender */}
                      <Select label="Gender" required name="gender" value={personal.gender} onChange={handlePersonalChange}>
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </Select>

                      {/* DOB */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Date of Birth <span className="text-red-500">*</span>
                          <span className="text-red-400 text-xs ml-1">(Must be 18+)</span>
                        </label>
                        <input
                          type="date"
                          name="date_of_birth"
                          value={personal.date_of_birth}
                          onChange={handlePersonalChange}
                          required
                          className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400 transition-colors"
                        />
                      </div>

                      {/* State (country-state-city) */}
                      <div>
                        <Label text="State" required />
                        <select
                          className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-orange-400 transition-colors"
                          value={personal.stateCode}
                          onChange={handleStateChange}
                        >
                          <option value="">Select State</option>
                          {allStates.map((s) => (
                            <option key={s.isoCode} value={s.isoCode}>{s.name}</option>
                          ))}
                        </select>
                      </div>

                      {/* District (country-state-city) */}
                      <div>
                        <Label text="District" required />
                        <select
                          className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-orange-400 transition-colors disabled:bg-gray-50 disabled:text-gray-400"
                          value={personal.district}
                          onChange={handleCityChange}
                          disabled={!personal.stateCode}
                        >
                          <option value="">Select District</option>
                          {allCities.map((c) => (
                            <option key={c.name} value={c.name}>{c.name}</option>
                          ))}
                        </select>
                      </div>

                      {/* Current Location */}
                      <Input
                        label="Current Location"
                        required
                        name="current_location"
                        value={personal.current_location}
                        onChange={handlePersonalChange}
                        placeholder="e.g. Madhapur, Hyderabad"
                      />

                      {/* Occupation */}
                      <Select label="Occupation / Status" required name="current_status" value={personal.current_status} onChange={handlePersonalChange}>
                        <option value="">Select Status</option>
                        <option>Student</option>
                        <option>Employed</option>
                        <option>Unemployed</option>
                        <option>Other</option>
                      </Select>

                    </div>

                    {/* Navigation */}
                    <div className="flex justify-between mt-6">
                      <button
                        type="button"
                        onClick={() => navigate("/")}
                        className="px-5 py-2 border-2 border-orange-400 text-orange-500 font-semibold rounded-lg hover:bg-orange-50 text-sm transition-colors"
                      >
                        ← Home
                      </button>
                      <button
                        type="button"
                        onClick={goNext}
                        className="px-6 py-2 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 text-sm transition-colors"
                      >
                        Next: Education →
                      </button>
                    </div>
                  </div>
                )}

                {/* ════════════════ STEP 2 ════════════════ */}
                {step === 2 && (
                  <div>
                    <p className="text-base font-bold text-orange-500 border-b-2 border-orange-100 pb-2 mb-5">
                      🎓 Education Details
                    </p>

                    {/* Qualification Selector */}
                    <div className="mb-4">
                      <Select
                        label="Highest Qualification"
                        required
                        name="highest_qualification"
                        value={edu.highest_qualification}
                        onChange={handleEduChange}
                      >
                        <option value="">-- Select Highest Qualification --</option>
                        <option value="below-10th">Below 10th</option>
                        <option value="10th">10th / SSC</option>
                        <option value="12th">12th / Intermediate</option>
                        <option value="iti">ITI</option>
                        <option value="polytechnic">Polytechnic</option>
                        <option value="graduation">Graduation</option>
                        <option value="double-graduation">Double Graduation</option>
                        <option value="postgraduation">Post Graduation</option>
                        <option value="double-postgraduation">Double Post Graduation</option>
                        <option value="phd">PhD</option>
                        <option value="other-edu">Other</option>
                      </Select>

                      {q && eduNoteMap[q] && (
                        <div className="mt-2 bg-orange-50 border border-orange-200 rounded-lg px-3 py-2 text-xs text-orange-700">
                          📋 {eduNoteMap[q]}
                        </div>
                      )}
                    </div>

                    {/* ── Below 10th ── */}
                    {q === "below-10th" && (
                      <EduBlock color="gray" icon="📋" title="Below 10th Details">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <Input
                            label="Details (optional)"
                            name="below10th_details"
                            value={edu.below10th_details}
                            onChange={handleEduChange}
                            placeholder="e.g. Class 8 completed"
                          />
                          <Input
                            label="School Name & Place"
                            name="below10th_schoolname"
                            value={edu.below10th_schoolname}
                            onChange={handleEduChange}
                            placeholder="School name and location"
                          />
                        </div>
                      </EduBlock>
                    )}

                    {/* ── 10th ── */}
                    {q === "10th" && (
                      <EduBlock color="gray" icon="📋" title="10th / SSC Details">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <Input
                            label="Board"
                            name="tenth_board"
                            value={edu.tenth_board}
                            onChange={handleEduChange}
                            placeholder="e.g. CBSE / BSEAP / BSETS"
                          />
                          <Input
                            label="School Name & Place"
                            name="tenth_schoolname"
                            value={edu.tenth_schoolname}
                            onChange={handleEduChange}
                            placeholder="School name and location"
                          />
                        </div>
                      </EduBlock>
                    )}

                    {/* ── 12th standalone ── */}
                    {q === "12th" && (
                      <EduBlock color="blue" icon="📚" title="12th / Intermediate Details">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <Select
                            label="Course"
                            required
                            name="intermediate_course"
                            value={edu.intermediate_course}
                            onChange={handleEduChange}
                          >
                            <option value="">Select Course</option>
                            {INTERMEDIATE_COURSES.map((c) => (
                              <option key={c.code} value={c.code}>{c.code} — {c.name}</option>
                            ))}
                          </Select>

                          {edu.intermediate_course === "Other" && (
                            <Input
                              label="Specify Course"
                              name="intermediate_course_other"
                              value={edu.intermediate_course_other}
                              onChange={handleEduChange}
                              placeholder="Course name"
                            />
                          )}

                          <Input
                            label="Board"
                            name="intermediate_board"
                            value={edu.intermediate_board}
                            onChange={handleEduChange}
                            placeholder="e.g. Telangana State Board"
                          />

                          {isInterVoc && (
                            <Input
                              label="Vocational Subject"
                              name="intermediate_vocational_subject"
                              value={edu.intermediate_vocational_subject}
                              onChange={handleEduChange}
                              placeholder="e.g. COPA, Electrical"
                            />
                          )}
                        </div>
                        <CollegeYearRow
                          eduState={edu}
                          setEduState={setEdu}
                          collegeKey="intermediate_college_name"
                          yearKey="intermediate_current_year"
                          showYear={false}
                          placeholder="e.g. Sri Chaitanya Junior College, Hyderabad"
                        />
                      </EduBlock>
                    )}

                    {/* ── ITI ── */}
                    {q === "iti" && (
                      <EduBlock color="yellow" icon="🔧" title="ITI Details">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <Select
                            label="Trade"
                            required
                            name="iti_trade"
                            value={edu.iti_trade}
                            onChange={handleEduChange}
                          >
                            <option value="">Select Trade</option>
                            {ITI_TRADES.map((t) => (
                              <option key={t}>{t}</option>
                            ))}
                          </Select>

                          {edu.iti_trade === "Other" && (
                            <Input
                              label="Specify Trade"
                              name="iti_trade_other"
                              value={edu.iti_trade_other}
                              onChange={handleEduChange}
                              placeholder="Enter trade name"
                            />
                          )}
                        </div>
                        <CollegeYearRow
                          eduState={edu}
                          setEduState={setEdu}
                          collegeKey="iti_college_name"
                          yearKey="iti_current_year"
                          showYear={false}
                          placeholder="ITI College name and place"
                        />
                      </EduBlock>
                    )}

                    {/* ── Polytechnic ── */}
                    {q === "polytechnic" && (
                      <EduBlock color="cyan" icon="⚙️" title="Polytechnic Details">
                        <Select
                          label="Branch"
                          required
                          name="polytechnic_branch"
                          value={edu.polytechnic_branch}
                          onChange={handleEduChange}
                        >
                          <option value="">Select Branch</option>
                          <optgroup label="Engineering Diplomas">
                            {ENGINEERING_DIPLOMAS.map((b) => <option key={b}>{b}</option>)}
                          </optgroup>
                          <optgroup label="Non-Engineering Diplomas">
                            {NON_ENGINEERING_DIPLOMAS.map((b) => <option key={b}>{b}</option>)}
                          </optgroup>
                        </Select>
                        <CollegeYearRow
                          eduState={edu}
                          setEduState={setEdu}
                          collegeKey="polytechnic_college_name"
                          yearKey="polytechnic_current_year"
                          showYear={false}
                          placeholder="Polytechnic college name and place"
                        />
                      </EduBlock>
                    )}

                    {/* ── Graduation flows ── */}
                    {q === "graduation" && (
                      <>{renderIntermediateBlock()}{renderGraduationBlock(1)}</>
                    )}
                    {q === "double-graduation" && (
                      <>{renderIntermediateBlock()}{renderGraduationBlock(1)}{renderGraduationBlock(2)}</>
                    )}
                    {q === "postgraduation" && (
                      <>{renderIntermediateBlock()}{renderGraduationBlock(1)}{renderPGBlock(1)}</>
                    )}
                    {q === "double-postgraduation" && (
                      <>{renderIntermediateBlock()}{renderGraduationBlock(1)}{renderPGBlock(1)}{renderPGBlock(2)}</>
                    )}

                    {/* ── PhD ── */}
                    {q === "phd" && (
                      <>
                        {renderIntermediateBlock()}
                        {renderGraduationBlock(1)}
                        <EduBlock color="indigo" icon="🔬" title="PhD Details">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <Input
                              label="Research Field"
                              name="phd_research_field"
                              value={edu.phd_research_field}
                              onChange={handleEduChange}
                              placeholder="Enter research field"
                            />
                            <Input
                              label="University"
                              name="phd_university"
                              value={edu.phd_university}
                              onChange={handleEduChange}
                              placeholder="e.g. Osmania University"
                            />
                            <Input
                              label="University Full Name"
                              name="phd_university_name"
                              value={edu.phd_university_name}
                              onChange={handleEduChange}
                              placeholder="Full university name"
                            />
                            <Select
                              label="Current Academic Status"
                              name="phd_current_year"
                              value={edu.phd_current_year}
                              onChange={handleEduChange}
                            >
                              <option value="">Select Year</option>
                              {CURRENT_YEAR_OPTIONS.map((y) => <option key={y}>{y}</option>)}
                            </Select>
                          </div>
                        </EduBlock>
                      </>
                    )}

                    {/* ── Other ── */}
                    {q === "other-edu" && (
                      <EduBlock color="gray" icon="📝" title="Other Education Details">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <Input
                            label="Name of the Course"
                            name="other_course_code"
                            value={edu.other_course_code}
                            onChange={handleEduChange}
                            placeholder="e.g. B.Tech"
                          />
                          <Input
                            label="Specialization"
                            name="other_course_specialization"
                            value={edu.other_course_specialization}
                            onChange={handleEduChange}
                            placeholder="e.g. Data Science"
                          />
                          <div className="md:col-span-2">
                            <Input
                              label="Course Full Name"
                              name="other_course_full_name"
                              value={edu.other_course_full_name}
                              onChange={handleEduChange}
                              placeholder="Course full name"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <Input
                              label="College / Institution Name"
                              name="other_education_full_name"
                              value={edu.other_education_full_name}
                              onChange={handleEduChange}
                              placeholder="Describe your education"
                            />
                          </div>
                          <Select
                            label="Current Academic Status"
                            name="other_education_current_year"
                            value={edu.other_education_current_year}
                            onChange={handleEduChange}
                          >
                            <option value="">Select Year</option>
                            {CURRENT_YEAR_OPTIONS.map((y) => <option key={y}>{y}</option>)}
                          </Select>
                        </div>
                      </EduBlock>
                    )}

                    {/* ════ Certificates & Additional ════ */}
                    <p className="text-base font-bold text-orange-500 border-b-2 border-orange-100 pb-2 mb-5 mt-6">
                      📜 Certificates & Additional Details
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

                      {/* Institution Type */}
                      <Select
                        label="Highest Institution Type"
                        name="highest_education_institution_type"
                        value={personal.highest_education_institution_type}
                        onChange={handlePersonalChange}
                      >
                        <option value="">Select Type</option>
                        <option value="government">Government</option>
                        <option value="Private">Private</option>
                      </Select>

                      {/* Physically Challenged */}
                      <RadioGroup
                        label="Physically Challenged"
                        name="physically_challenged"
                        value={personal.physically_challenged}
                        options={["Yes", "No"]}
                        onChange={handlePersonalChange}
                      />

                      {/* Other Certificate */}
                      <div>
                        <RadioGroup
                          label="Any other certificate / Diploma?"
                          name="hasOtherCert"
                          value={hasOtherCert}
                          options={["yes", "no"]}
                          onChange={(e) => setHasOtherCert(e.target.value)}
                        />
                        {hasOtherCert === "yes" && (
                          <input
                            type="text"
                            className="mt-2 w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
                            value={otherCertDetail}
                            onChange={(e) => setOtherCertDetail(e.target.value)}
                            placeholder="Enter certificate details"
                          />
                        )}
                      </div>

                      {/* Technical Cert */}
                      <div>
                        <RadioGroup
                          label="Technical Skill Certifications?"
                          name="hasTechCert"
                          value={hasTechCert}
                          options={["yes", "no"]}
                          onChange={(e) => setHasTechCert(e.target.value)}
                        />
                        {hasTechCert === "yes" && (
                          <input
                            type="text"
                            className="mt-2 w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
                            value={techCertDetail}
                            onChange={(e) => setTechCertDetail(e.target.value)}
                            placeholder="e.g. Tally, Python, etc."
                          />
                        )}
                      </div>

                      {/* Social Status */}
                      <Select
                        label="Social Status"
                        name="social_status"
                        value={personal.social_status}
                        onChange={handlePersonalChange}
                      >
                        <option value="">Select Category</option>
                        {["OC", "SC", "ST", "BC-A", "BC-B", "BC-C", "BC-D", "BC-E", "Minority", "Prefer not to disclose"].map(
                          (v) => <option key={v}>{v}</option>
                        )}
                      </Select>

                      {/* Additional Support */}
                      <Select
                        label="Additional Support (Counseling)"
                        name="additional_support"
                        value={personal.additional_support}
                        onChange={handlePersonalChange}
                      >
                        <option value="">Select Support</option>
                        <option>General studies</option>
                        <option>Only Maths</option>
                        <option>Only English</option>
                        <option>Only Reasoning</option>
                        <option>All of the above</option>
                      </Select>

                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

                      {/* Preferences */}
                      <div>
                        <Label text={`⭐ Exam Preferences (up to ${MAX_PREF} categories)`} />
                        {renderPreferences()}
                      </div>

                      {/* How did you find us */}
                      <div>
                        <Select
                          label="How did you find Career Mitra?"
                          name="how_did_you_come_across_career_mitra"
                          value={personal.how_did_you_come_across_career_mitra}
                          onChange={handlePersonalChange}
                        >
                          <option value="">Select</option>
                          {["LinkedIn", "WhatsApp", "Facebook", "Instagram", "YouTube", "Friends/Campaign", "Social Media", "Other"].map(
                            (v) => <option key={v}>{v}</option>
                          )}
                        </Select>
                        {personal.how_did_you_come_across_career_mitra === "Other" && (
                          <input
                            type="text"
                            name="how_did_you_come_across_career_mitra_other"
                            className="mt-2 w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
                            value={personal.how_did_you_come_across_career_mitra_other}
                            onChange={handlePersonalChange}
                            placeholder="Please specify"
                          />
                        )}
                      </div>

                    </div>

                    {/* Navigation */}
                    <div className="flex justify-between mt-6">
                      <button
                        type="button"
                        onClick={goPrev}
                        className="px-5 py-2 border-2 border-orange-400 text-orange-500 font-semibold rounded-lg hover:bg-orange-50 text-sm transition-colors"
                      >
                        ← Previous
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 text-sm transition-colors"
                      >
                        ✓ Submit Profile
                      </button>
                    </div>
                  </div>
                )}

              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}