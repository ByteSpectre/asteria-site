export function lockPageScroll() {
  const html = document.documentElement;
  const body = document.body;
  const scrollbarWidth = Math.max(0, window.innerWidth - html.clientWidth);
  const previous = {
    bodyOverflow: body.style.overflow,
    htmlOverflow: html.style.overflow,
    bodyPaddingRight: body.style.paddingRight,
    compensation: html.style.getPropertyValue("--scrollbar-compensation"),
  };

  html.style.overflow = "hidden";
  body.style.overflow = "hidden";

  if (scrollbarWidth > 0) {
    const pad = `${scrollbarWidth}px`;
    body.style.paddingRight = pad;
    html.style.setProperty("--scrollbar-compensation", pad);
  }

  return () => {
    html.style.overflow = previous.htmlOverflow;
    body.style.overflow = previous.bodyOverflow;
    body.style.paddingRight = previous.bodyPaddingRight;

    if (previous.compensation) {
      html.style.setProperty("--scrollbar-compensation", previous.compensation);
    } else {
      html.style.removeProperty("--scrollbar-compensation");
    }
  };
}
