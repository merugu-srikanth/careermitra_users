import { FEATURES, STEPS, FAQS } from "./content";

// Static article content shown below the tool (server component — no JS shipped).
// Full page width like the rest of the site; on laptops the text sits in two columns
// (article | FAQs) so lines stay easy to read.
export default function CompressorContent() {
  return (
    <section className="w-full mx-auto px-4 md:px-15 pt-4 pb-12 text-slate-700 leading-relaxed">
      <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 items-start">
        {/* ── Article ── */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 leading-snug">
            Career Mitra Image Compressor: Resize Photos and Signatures in Seconds
          </h2>

          <p className="mt-4">
            For government job aspirants months of preparation come down to one small detail on the form,
            and it has nothing to do with the syllabus. &quot;Upload photo, 20 to 50 KB, 200 x 230 pixels,
            JPG only.&quot; A requirement nobody mentioned in any coaching class, standing between an
            aspirant and the submit button.
          </p>
          <p className="mt-4">
            The <strong>Career Mitra Image Compressor</strong> was built for that exact moment. It is a free
            tool for anyone filling government job applications. Choose the exam: SSC, UPSC, IBPS, SBI, RRB,
            TGPSC, APPSC, NEET UG, or JEE Main and the required size, dimensions, and format appear
            instantly, with no need to calculate the right numbers.
          </p>
          <p className="mt-4">
            Prefer to set it manually? Switch to &quot;By Size (KB)&quot; and enter the exact limit from the
            notification. Upload up to five images in that category at once, and each one gets matched to
            the right size and format.
          </p>

          <h3 className="mt-8 text-lg font-bold text-slate-900">Key Features of the Image Compressor</h3>
          <div className="mt-3 overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-900">
                  <th scope="col" className="px-4 py-3 font-bold border-b border-slate-200 whitespace-nowrap">Feature</th>
                  <th scope="col" className="px-4 py-3 font-bold border-b border-slate-200">What It Offers</th>
                </tr>
              </thead>
              <tbody>
                {FEATURES.map(([feature, offer]) => (
                  <tr key={feature} className="odd:bg-white even:bg-slate-50/60">
                    <th scope="row" className="px-4 py-3 font-medium text-slate-800 border-b border-slate-100 align-top whitespace-nowrap">{feature}</th>
                    <td className="px-4 py-3 border-b border-slate-100 align-top">{offer}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-6">
            Compression and resizing solve two different problems. A smartphone photo larger than 1 MB may
            need to come down to 50 KB if that is a portal&apos;s limit. The same portal may also set a
            specific width and height in pixels.
          </p>
          <p className="mt-4">
            Compression handles the first requirement while resizing handles the second. Meeting one does
            not automatically satisfy the other, so the tool treats them as separate steps.
          </p>

          <h3 className="mt-8 text-lg font-bold text-slate-900">How Career Mitra Handles Uploaded Images</h3>
          <p className="mt-3">
            A photo or signature carries personal information, and the tool is built with that in mind.
            Processing happens directly inside the browser. Selected photos and signatures are not uploaded
            to Career Mitra&apos;s servers for compression. Downloaded files are saved through the
            browser&apos;s normal download process, the same as any other file saved from a website.
          </p>

          <h3 className="mt-8 text-lg font-bold text-slate-900">Prepare an Image in Five Simple Steps</h3>
          <ol className="mt-3 list-decimal pl-6 space-y-2">
            {STEPS.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>

          <h3 className="mt-8 text-lg font-bold text-slate-900">Upcoming Features and Improvements</h3>
          <p className="mt-3">
            Feedback from applicants is shaping the roadmap ahead. Planned additions include exam-specific
            presets for SSC, UPSC, IBPS, and Railways forms, batch processing so a photo and signature can be
            prepared together, a PDF size reducer for certificates, and smoother performance on slower
            connections.
          </p>
        </div>

        {/* ── FAQs + closing note ── */}
        <aside className="lg:sticky lg:top-28 rounded-2xl border border-slate-200 bg-slate-50/60 p-5 sm:p-6">
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">FAQs</h2>
          <div className="mt-4 space-y-5">
            {FAQS.map((faq) => (
              <div key={faq.q}>
                <h3 className="font-bold text-slate-900">{faq.q}</h3>
                <p className="mt-1 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>

          <h3 className="mt-8 text-lg font-bold text-slate-900">A Small Step That Matters</h3>
          <p className="mt-3 text-sm">
            Most applications fail or succeed on small details. A photo that meets the required size and
            dimensions is one of them. Meeting the file size alone does not guarantee a form clears every
            check, since background and format rules can still vary by post. It is worth a quick check
            against the notification before the final submission.
          </p>
          <p className="mt-3 text-sm">
            The Career Mitra Image Compressor exists so a technical upload error is never the reason an
            application gets delayed. For specific requirements, Career Mitra&apos;s guides on SSC photo and
            signature rules, UPSC application guidelines, and Banking exam instructions cover the details
            form by form.
          </p>
        </aside>
      </div>

      <p className="mt-10 text-center text-xs text-slate-400">
        Images are processed in your browser. Nothing is uploaded to any server.
      </p>
    </section>
  );
}
