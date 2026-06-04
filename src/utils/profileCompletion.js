const isFilled = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim() !== "";
  if (Array.isArray(value)) return value.some((item) => isFilled(item));
  if (typeof value === "object") return Object.keys(value).some((key) => isFilled(value[key]));
  return true;
};

const getEducationKeys = (qualificationLevel) => {
  const q = String(qualificationLevel || "").toLowerCase();
  if (/phd|doctorate/.test(q)) {
    return [
      "qualification_level",
      "phd_research_field",
      "phd_university_name",
      "phd_current_year",
    ];
  }
  if (/post|pg|master|m\.sc|m\.com|m\.ba/.test(q)) {
    return [
      "qualification_level",
      "graduation_course",
      "graduation_college_name",
      "graduation_current_year",
      "post_graduation_course",
      "post_graduation_college_name",
      "post_graduation_current_year",
    ];
  }
  if (/double.*post|second.*post/.test(q)) {
    return [
      "qualification_level",
      "graduation_course",
      "graduation_college_name",
      "graduation_current_year",
      "post_graduation_course",
      "post_graduation_college_name",
      "post_graduation_current_year",
      "second_post_graduation_course",
      "second_post_graduation_college_name",
      "second_post_graduation_current_year",
    ];
  }
  if (/graduation|bachelor|ug|degree/.test(q)) {
    return [
      "qualification_level",
      "graduation_course",
      "graduation_college_name",
      "graduation_current_year",
    ];
  }
  if (/double.*graduation|second.*graduation/.test(q)) {
    return [
      "qualification_level",
      "graduation_course",
      "graduation_college_name",
      "graduation_current_year",
      "second_graduation_course",
      "second_graduation_college_name",
      "second_graduation_current_year",
    ];
  }
  if (/diploma/.test(q)) {
    return [
      "qualification_level",
      "diploma_branch",
      "diploma_current_year",
    ];
  }
  if (/polytechnic/.test(q)) {
    return [
      "qualification_level",
      "polytechnic_branch",
      "polytechnic_college_name",
      "polytechnic_current_year",
    ];
  }
  if (/iti/.test(q)) {
    return [
      "qualification_level",
      "iti_trade",
      "iti_college_name",
      "iti_current_year",
    ];
  }
  if (/12|intermediate|higher.*secondary|hs|senior.*secondary|12th/.test(q)) {
    return [
      "qualification_level",
      "intermediate_course",
      "intermediate_board",
      "intermediate_college_name",
    ];
  }
  if (/10|tenth|secondary/.test(q)) {
    return [
      "qualification_level",
      "tenth_board",
      "tenth_school_name",
    ];
  }
  return ["qualification_level"];
};

export const flattenEducation = (edu) => {
  if (!edu) return {};
  const first = (...vals) => vals.find((v) => v !== undefined && v !== null);
  const gradSubjects = Array.isArray(edu.graduation?.subjects)
    ? edu.graduation.subjects
    : [edu.graduation_subject1, edu.graduation_subject2, edu.graduation_subject3];
  const pgSubjects = Array.isArray(edu.post_graduation?.subjects)
    ? edu.post_graduation.subjects
    : [edu.pg_subject1, edu.pg_subject2, edu.pg_subject3];
  const secondGradSubjects = Array.isArray(edu.second_graduation?.subjects)
    ? edu.second_graduation.subjects
    : [edu.second_graduation_subject1, edu.second_graduation_subject2, edu.second_graduation_subject3];
  const secondPgSubjects = Array.isArray(edu.second_post_graduation?.subjects)
    ? edu.second_post_graduation.subjects
    : [edu.second_pg_subject1, edu.second_pg_subject2, edu.second_pg_subject3];

  const out = {
    qualification_level: edu.qualification_level,
    below10th_details: first(edu.below10th?.details, edu.below10th_details), below10th_school_name: first(edu.below10th?.school_name, edu.below10th_schoolname),
    tenth_board: first(edu.tenth?.board, edu["10th_board"], edu.tenth_board), tenth_school_name: first(edu.tenth?.school_name, edu["10th_schoolname"], edu.tenth_schoolname),
    intermediate_course: first(edu.intermediate?.course, edu.intermediate_course), intermediate_board: first(edu.intermediate?.board, edu.intermediate_board),
    intermediate_college_name: first(edu.intermediate?.college_name, edu.intermediate_college_name),
    iti_trade: first(edu.iti?.trade, edu.iti_trade), iti_college_name: first(edu.iti?.college_name, edu.iti_college_name), iti_current_year: first(edu.iti?.current_year, edu.iti_current_year),
    polytechnic_branch: first(edu.polytechnic?.branch, edu.polytechnic_branch), polytechnic_college_name: first(edu.polytechnic?.college_name, edu.polytechnic_college_name), polytechnic_current_year: first(edu.polytechnic?.current_year, edu.polytechnic_current_year),
    diploma_branch: first(edu.diploma?.branch, edu.diploma_branch), diploma_current_year: first(edu.diploma?.current_year, edu.diploma_current_year),
    graduation_course: first(edu.graduation?.course, edu.graduation_course), graduation_college_name: first(edu.graduation?.college_name, edu.graduation_college_name),
    graduation_current_year: first(edu.graduation?.current_year, edu.graduation_current_year),
    graduation_subject1: first(gradSubjects[0], edu.graduation_subject1), graduation_subject2: first(gradSubjects[1], edu.graduation_subject2), graduation_subject3: first(gradSubjects[2], edu.graduation_subject3),
    second_graduation_course: first(edu.second_graduation?.course, edu.second_graduation_course), second_graduation_college_name: first(edu.second_graduation?.college_name, edu.second_graduation_college_name),
    second_graduation_current_year: first(edu.second_graduation?.current_year, edu.second_graduation_current_year),
    second_graduation_subject1: first(secondGradSubjects[0], edu.second_graduation_subject1), second_graduation_subject2: first(secondGradSubjects[1], edu.second_graduation_subject2), second_graduation_subject3: first(secondGradSubjects[2], edu.second_graduation_subject3),
    post_graduation_course: first(edu.post_graduation?.course, edu.post_graduation_course), post_graduation_college_name: first(edu.post_graduation?.college_name, edu.pg_college_name),
    post_graduation_current_year: first(edu.post_graduation?.current_year, edu.pg_current_year),
    post_graduation_subject1: first(pgSubjects[0], edu.pg_subject1), post_graduation_subject2: first(pgSubjects[1], edu.pg_subject2), post_graduation_subject3: first(pgSubjects[2], edu.pg_subject3),
    second_post_graduation_course: first(edu.second_post_graduation?.course, edu.second_post_graduation_course), second_post_graduation_college_name: first(edu.second_post_graduation?.college_name, edu.second_pg_college_name),
    second_post_graduation_current_year: first(edu.second_post_graduation?.current_year, edu.second_pg_current_year),
    second_post_graduation_subject1: first(secondPgSubjects[0], edu.second_pg_subject1), second_post_graduation_subject2: first(secondPgSubjects[1], edu.second_pg_subject2), second_post_graduation_subject3: first(secondPgSubjects[2], edu.second_pg_subject3),
    phd_research_field: first(edu.phd?.research_field, edu.phd_research_field), phd_university_name: first(edu.phd?.university_name, edu.phd_university_name), phd_current_year: first(edu.phd?.current_year, edu.phd_current_year),
  };
  Object.keys(out).forEach(k => { if (!isFilled(out[k])) delete out[k]; });
  return out;
};

export const calculateProfileCompletion = (profile) => {
  if (!profile || typeof profile !== "object") return 0;

  const personalKeys = [
    "name",
    "email",
    "phone",
    "gender",
    "date_of_birth",
    "state",
    "district",
    "current_location",
    "current_status",
    "social_status",
  ];

  const education = profile.education || {};
  const educationKeys = getEducationKeys(education.qualification_level);
  const requiredKeys = [...personalKeys, ...educationKeys];

  if (requiredKeys.length === 0) return 0;
  if (!isFilled(education.qualification_level)) return 0;

  const filledCount = requiredKeys.reduce((count, key) => {
    const value = key in profile ? profile[key] : education[key];
    return isFilled(value) ? count + 1 : count;
  }, 0);

  return Math.min(100, Math.max(0, Math.round((filledCount / requiredKeys.length) * 100)));
};

export default calculateProfileCompletion;
