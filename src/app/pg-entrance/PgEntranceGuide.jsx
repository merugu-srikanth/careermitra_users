// Server component — editorial content for the /pg-entrance landing page.
// Text is taken verbatim from "Common PG Entrance Tests – Landing Page"; do not
// reword it. Rendered on the server so the full guide is in the SSR HTML.

const EXAMS_BY_STREAM = [
  { area: "Management", exams: "CAT, XAT, CMAT, MAT, NMAT, SNAP, ATMA", pathway: "MBA/PGDM and related programs" },
  { area: "Engineering & Technology", exams: "GATE", pathway: "MTech/ME/MS and related programs" },
  { area: "Science", exams: "CUET PG, IIT JAM", pathway: "MSc and related programs" },
  { area: "Humanities & Commerce", exams: "CUET PG", pathway: "MA, MCom, and related programs" },
  { area: "Computer Applications", exams: "NIMCET", pathway: "MCA" },
  { area: "Law", exams: "CLAT PG, AILET PG", pathway: "LLM" },
  { area: "Medical", exams: "NEET PG, INI-CET", pathway: "MD/MS and related PG medical programs" },
  { area: "Dental", exams: "NEET MDS", pathway: "MDS" },
  { area: "AYUSH", exams: "AIAPGET", pathway: "PG AYUSH programs" },
  { area: "Agriculture", exams: "ICAR AIEEA (PG)", pathway: "MSc/Master's in agriculture and allied fields" },
  { area: "Design", exams: "CEED, NID DAT, NIFT", pathway: "MDes and other relevant design PG programs" },
  { area: "Research/Fellowships", exams: "UGC-NET, CSIR-UGC NET, DBT-BET, ICMR-JRF", pathway: "Research, JRF, teaching/PhD pathways" },
];

const EXAM_TO_COURSE = [
  ["MBA/PGDM", "CAT, XAT, CMAT, MAT, NMAT, SNAP, or ATMA"],
  ["MTech/ME", "GATE"],
  ["MSc", "CUET PG or IIT JAM, depending on the program and institution"],
  ["MCA", "NIMCET, along with institution-specific routes"],
  ["LLM", "CLAT PG or AILET PG, plus university-specific routes"],
  ["MD/MS", "NEET PG or INI-CET, depending on the institution"],
  ["MDS", "NEET MDS"],
  ["PG AYUSH", "AIAPGET"],
  ["Design PG", "NID DAT, CEED, or NIFT, depending on the program"],
  ["Agriculture PG", "ICAR AIEEA (PG)"],
];

const CHOOSING_FACTORS = [
  ["The postgraduate course itself.", "This decides which exam family applies in the first place."],
  ["Target universities and institutes.", "Not every institution accepts every exam, so this filters the list quickly."],
  ["Eligibility requirements.", "Undergraduate background and minimum qualifying marks vary by exam and by institution."],
  ["Exam pattern and syllabus.", "Some exams suit certain strengths better than others, and preparation time should reflect that."],
  ["Application and admission timeline.", "Registration dates, exam windows, and result timelines rarely align across exams, so tracking them early avoids missed deadlines."],
];

const H3 = ({ children }) => (
  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 tracking-tight mt-10 mb-3 flex items-center gap-2">
    <span className="h-5 w-1 rounded-full bg-gradient-to-b from-orange-500 to-amber-400 shrink-0" />
    {children}
  </h3>
);

const H4 = ({ children }) => (
  <h4 className="text-base sm:text-lg font-semibold text-orange-700 mt-6 mb-2">{children}</h4>
);

const P = ({ children }) => (
  <p className="text-sm sm:text-[15px] text-gray-600 leading-relaxed mb-3">{children}</p>
);

export default function PgEntranceGuide() {
  return (
    <section className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-15 my-10 sm:my-12">
      <article className="bg-white rounded-3xl border border-orange-100 shadow-sm p-5 sm:p-8 lg:p-12">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-tight bg-gradient-to-r from-gray-900 via-orange-600 to-green-600 bg-clip-text text-transparent mb-4">
          National-Level PG Entrance Exams in India 2026
        </h2>
        <P>
          Postgraduate admissions in India run through several national-level entrance exams. The right exam depends on the
          course a candidate wants to pursue, the institutions they desire to join, and the admission route those
          institutions follow.
        </P>
        <P>
          Management, engineering, science, humanities, law, medicine, design, and agriculture: each field has its own
          entrance test, and knowing which one applies is the first real step in the process.
        </P>

        <H3>Which PG entrance exam should a student take?</H3>
        <P>
          There isn&apos;t one answer that fits everyone. CAT covers management admissions. GATE opens several postgraduate
          engineering and technology routes. CUET PG applies to a wide range of postgraduate programs across participating
          institutions, while NEET PG and INI-CET handle specific medical admission routes. Every other discipline has its
          own national-level test, separate from these.
        </P>
        <P>
          This lists out the major national-level PG entrance exams in India for 2026, explains what each one is used for,
          and helps narrow down which exam matters for a given postgraduate goal.
        </P>

        <H3>PG Entrance Exams by Course and Stream</H3>
        <div className="overflow-x-auto rounded-2xl border border-gray-200 mt-4">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                <th className="px-4 py-3 font-semibold">Study Area</th>
                <th className="px-4 py-3 font-semibold">Major National-Level Exams</th>
                <th className="px-4 py-3 font-semibold">Typical PG Pathway</th>
              </tr>
            </thead>
            <tbody>
              {EXAMS_BY_STREAM.map((row, i) => (
                <tr key={row.area} className={`border-t border-gray-100 ${i % 2 ? "bg-orange-50/40" : "bg-white"}`}>
                  <td className="px-4 py-3 font-semibold text-gray-900">{row.area}</td>
                  <td className="px-4 py-3 text-gray-700">{row.exams}</td>
                  <td className="px-4 py-3 text-gray-600">{row.pathway}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <H3>What Counts as a National-Level PG Entrance Exam?</H3>
        <P>
          A national-level exam is conducted across the country or accepts candidates from across the country, rather than
          staying limited to one state or one institution.
        </P>
        <P>
          That doesn&apos;t mean every national exam opens doors everywhere. Most institutions treat these scores as one part
          of a larger admission process. Cutoffs, interviews, group discussions, and institution-specific rounds often
          follow the written test. So it helps to check how a target institution actually uses a given exam score, rather
          than assuming a national tag guarantees a seat.
        </P>

        <H3>Major National-Level PG Entrance Exams in India</H3>

        <H4>Management</H4>
        <P>
          CAT, XAT, CMAT, MAT, NMAT, SNAP, and ATMA are the main exams for MBA and PGDM admissions. Each one is accepted by a
          different set of business schools, and the overlap between them is only partial. CAT is used widely by IIMs and
          several other management institutes. The rest are accepted by a broader, somewhat different mix of colleges.
          Picking the right exam here comes down to the specific institutions on a candidate&apos;s list, not the exam&apos;s
          reputation.
        </P>

        <H4>Engineering and Technology</H4>
        <P>
          GATE, the Graduate Aptitude Test in Engineering, is the main exam in this category. IITs, IISc, and several other
          institutions use GATE scores for postgraduate admissions in engineering, technology, and related science
          programs, though each institution sets its own rules on top of the score. GATE also feeds into recruitment for
          public sector undertakings, which gives it a second purpose beyond admissions.
        </P>

        <H4>Science, Humanities, and Commerce</H4>
        <P>
          CUET PG and IIT JAM cover this space, though they don&apos;t overlap much. CUET PG is accepted by a large number of
          central, state, deemed, and private universities, spanning postgraduate programs such as MA, MCom, and MSc. IIT
          JAM stays narrower. It focuses mainly on postgraduate science admissions at IITs and a small group of other
          institutions.
        </P>

        <H4>Computer Applications</H4>
        <P>
          NIMCET is the main route into MCA programs, mostly at NITs and a handful of other technical institutes that
          participate in the exam.
        </P>

        <H4>Law</H4>
        <P>
          CLAT PG and AILET PG are the two main exams for LLM admissions. Both exams lead admissions into National Law
          Universities and other participating law schools, and the choice between them usually depends on which
          institutions a candidate is targeting.
        </P>

        <H4>Medical and Dental</H4>
        <P>
          Medical and dental PG admissions work differently from the rest of this list, largely because the stakes and the
          structure are different.
        </P>
        <ul className="list-disc pl-5 space-y-2 text-sm sm:text-[15px] text-gray-600 leading-relaxed mb-3 marker:text-orange-500">
          <li><strong className="text-gray-900">NEET PG</strong> covers MD, MS, and related medical postgraduate admissions.</li>
          <li>
            <strong className="text-gray-900">INI-CET</strong> applies to PG medical programs, including MD, MS, DM, MCh, and MDS, at
            Institutes of National Importance. That list includes AIIMS institutions, JIPMER, PGIMER, NIMHANS, and SCTIMST.
          </li>
          <li><strong className="text-gray-900">NEET MDS</strong> handles dental postgraduate admissions.</li>
          <li><strong className="text-gray-900">AIAPGET</strong> covers postgraduate AYUSH programs.</li>
        </ul>

        <H4>Agriculture and Allied Sciences</H4>
        <P>
          ICAR AIEEA (PG) and related ICAR admission routes serve postgraduate admissions in agriculture and allied sciences,
          mainly at participating agricultural universities across the country.
        </P>

        <H4>Design</H4>
        <P>
          Design aspirants mainly have three routes to choose from: NID DAT (PG), CEED, and the NIFT entrance exam. Each
          connects to a different set of design institutes, so the choice depends on the specific program a candidate
          wants.
        </P>

        <H4>Research and Fellowship Eligibility Exams</H4>
        <P>
          These exams work on a different logic altogether, and it&apos;s worth separating them clearly from the admission
          exams above.
        </P>
        <ul className="list-disc pl-5 space-y-1.5 text-sm sm:text-[15px] text-gray-600 leading-relaxed mb-3 marker:text-orange-500">
          <li>UGC-NET</li>
          <li>CSIR-UGC NET</li>
          <li>DBT-BET</li>
          <li>ICMR-JRF</li>
        </ul>
        <P>
          None of these function like a standard entrance test. Instead, they establish eligibility for research
          fellowships, teaching positions, or PhD-related pathways. Clearing one of these doesn&apos;t hand a candidate a seat
          in a specific PG program the way CAT or GATE does. It opens up a different category of opportunity altogether,
          mostly tied to research and academia.
        </P>

        <H3>Matching the Exam to the Course</H3>
        <P>
          The quick-reference table above covers most cases, but here&apos;s the same information mapped directly against
          common postgraduate courses:
        </P>
        <ul className="list-disc pl-5 space-y-2 text-sm sm:text-[15px] text-gray-600 leading-relaxed mb-3 marker:text-orange-500">
          {EXAM_TO_COURSE.map(([course, exams]) => (
            <li key={course}>
              <strong className="text-gray-900">{course}</strong>: {exams}
            </li>
          ))}
        </ul>

        <H3>Choosing the Right Exam: What Actually Matters</H3>
        <P>Once the broad category is clear, five factors make things more clear.</P>
        <ol className="list-decimal pl-5 space-y-2 text-sm sm:text-[15px] text-gray-600 leading-relaxed mb-3 marker:text-orange-600 marker:font-semibold">
          {CHOOSING_FACTORS.map(([title, text]) => (
            <li key={title}>
              <strong className="text-gray-900">{title}</strong> {text}
            </li>
          ))}
        </ol>
        <P>
          Institutions update their admission notifications every year, and participating lists, accepted scores, and
          eligibility rules vary along with them. Checking the current notification directly, rather than relying on older
          information, remains the safest approach.
        </P>

        <H3>National-Level vs University-Level Exams</H3>
        <P>
          National-level exams get accepted across multiple institutions and regions, which is what makes a single test
          useful for a wide range of applications. University-level exams work differently. A single university, or a
          small group of them, conducts these tests, and the results usually apply only within that group.
        </P>
        <P>
          A good score on a national entrance exam doesn&apos;t always guarantee a seat. Many institutions add their own
          conditions on top of it, whether that means extra eligibility criteria, additional tests, interviews, or other
          selection rounds.
        </P>

        <H3>Preparing for PG Entrance Exams</H3>
        <P>
          A clear plan makes PG entrance preparation easier to manage. The first step is checking eligibility criteria and
          shortlisting exams that match the intended course and target institutions. Next comes downloading the latest
          syllabus, going through the exam pattern, and solving previous years&apos; papers. Once the basics feel solid, mock
          tests are the natural next step. Application deadlines need equal attention, since a missed date can undo weeks
          of preparation.
        </P>
        <P>
          This order keeps preparation focused and avoids wasted effort on exams or subjects that don&apos;t fit the actual
          goal.
        </P>
        <P>
          India runs several national-level postgraduate entrance exams, and each one serves a different discipline and a
          different admission system. PG admission isn&apos;t one single process. Every exam comes with its own eligibility
          rules, participating institutions, syllabus, and selection stages. Spotting the right exam early and checking how
          target institutions accept it makes both preparation and applications far more effective.
        </P>
      </article>
    </section>
  );
}
