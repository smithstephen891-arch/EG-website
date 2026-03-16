export default function ApplyPage() {
  return (
    <>
      <section className="bg-olive/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-3xl">
            <h1 className="font-serif text-4xl md:text-5xl text-charcoal">
              Apply for Assistance
            </h1>
            <p className="mt-6 text-lg text-charcoal/70 leading-relaxed">
              If you or someone you know is in need of mobility or medical
              equipment, please fill out the application below. We are honored to
              help.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-cream">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 text-center">
          <p className="text-charcoal/70 text-lg mb-8">
            Click the button below to open the application form. It only takes a
            few minutes to complete.
          </p>
          <a
            href="https://docs.google.com/document/u/1/d/1UP9zc5mnnwxMGk9ntLCZO_bWPjz8l6FD9Kr-6mNy2Vs/mobilebasic"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-full bg-olive px-10 py-3.5 font-semibold text-white hover:bg-olive-light transition-colors"
          >
            Open Application Form
          </a>
        </div>
      </section>
    </>
  );
}
