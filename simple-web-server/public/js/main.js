const pageHeader = `
   <header class="page-header">
      <div class="container">
        <nav class="page-header__nav">
          <a class="page-header__nav-link" href="/">Home</a>
          <a class="page-header__nav-link" href="/quotes">Quotes</a>
          <a class="page-header__nav-link" href="/survey.html">Survey</a>
          <a class="page-header__nav-link" href="/about.html">About</a>
        </nav>
      </div>
    </header>
`;

document.querySelector("body").insertAdjacentHTML("afterbegin", pageHeader);
