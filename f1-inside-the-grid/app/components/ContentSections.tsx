export function OverviewSection() {
  return (
    <div className="panel panel-overview">
      <h2>Our Goal</h2>
      <p>
        <strong>F1 Inside the Grid</strong> is built for two types of people:
        those dreaming of getting into Formula 1, and those already obsessed
        with every lap, pit stop, and setup change.
      </p>
      <p>
        We translate the intense, high-tech world of F1 into clear language,
        rich history, and a living database of cars, drivers, and stats that
        grows with every season and race.
      </p>
      <ul className="highlight-list">
        <li>Learn the language of the paddock with real F1 jargon.</li>
        <li>Discover how the sport evolved from danger to data-driven precision.</li>
        <li>
          Explore cars and drivers connected through stats, seasons, and team
          history.
        </li>
      </ul>
    </div>
  )
}

export function LearnSection() {
  return (
    <div className="panel panel-learn">
      <h2>Learn the Language of F1</h2>
      <p>
        F1 has its own vocabulary. Master these terms and you will never feel
        lost on a race weekend again.
      </p>
      <div className="jargon-grid">
        <div className="jargon-card">
          <h3>DRS (Drag Reduction System)</h3>
          <p>
            A movable rear wing flap that opens in specific zones to reduce
            drag and increase top speed when chasing another car.
          </p>
        </div>
        <div className="jargon-card">
          <h3>Undercut</h3>
          <p>
            Pitting earlier than the car ahead to use fresher tyres and gain
            enough lap time to overtake when they stop.
          </p>
        </div>
        <div className="jargon-card">
          <h3>Overcut</h3>
          <p>
            Staying out longer on older tyres, using clear air and race pace to
            jump cars that pitted before you.
          </p>
        </div>
        <div className="jargon-card">
          <h3>Dirty Air</h3>
          <p>
            Turbulent airflow coming off a car ahead that reduces grip and
            makes following closely through corners difficult.
          </p>
        </div>
        <div className="jargon-card">
          <h3>Parc Ferm&eacute;</h3>
          <p>
            A secure area where cars are held before and after qualifying and
            races; teams cannot make major setup changes here.
          </p>
        </div>
        <div className="jargon-card">
          <h3>Power Unit</h3>
          <p>
            Modern F1 engines: a 1.6L turbo V6 plus hybrid systems that recover
            energy from braking and exhaust gases.
          </p>
        </div>
        <div className="jargon-card">
          <h3>Delta</h3>
          <p>
            The time difference a driver must respect, often under safety car
            or virtual safety car conditions.
          </p>
        </div>
        <div className="jargon-card">
          <h3>The Grid</h3>
          <p>
            The starting formation of cars before lights out, ordered by
            qualifying times and penalties.
          </p>
        </div>
      </div>
    </div>
  )
}

export function HistorySection() {
  return (
    <div className="panel panel-history">
      <h2>History &amp; Fun Facts</h2>
      <p>
        From roaring V12s to ultra-efficient hybrids, F1 has constantly evolved
        while remaining the absolute peak of motorsport.
      </p>
      <ul className="fact-list">
        <li>
          The first official Formula 1 World Championship season was in 1950,
          with the opening race held at Silverstone in the United Kingdom.
        </li>
        <li>
          Teams are scored in the <strong>Constructors&apos; Championship</strong>,
          while drivers fight for the <strong>Drivers&apos; Championship</strong>.
        </li>
        <li>
          Modern F1 cars can generate more downforce than their own weight,
          theoretically allowing them to drive upside down in a tunnel.
        </li>
        <li>
          Pit stops regularly drop below two seconds, including lifting the car,
          changing four tyres, and sending the driver back out.
        </li>
        <li>
          Safety innovations from F1, such as carbon-fibre monocoques and the
          halo, have dramatically reduced serious injuries.
        </li>
        <li>
          Every season the technical regulations evolve, which is why our car
          and driver database is organised by year.
        </li>
      </ul>
    </div>
  )
}
