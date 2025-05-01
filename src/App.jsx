import { useEffect, useState, useRef } from "react";

function App() {
  const hasFetched = useRef(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [visibles, setVisibles] = useState([]);

  async function getDecodedURL () {
    const url = 'https://wgg522pwivhvi5gqsn675gth3q0otdja.lambda-url.us-east-1.on.aws/637572';

    try {
      setLoading(true);
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Response error: ${res.status}`);
        else setLoading(false);

      const text = await res.text();
      setData(text.split(''));
    } catch (error) {
      console.error(error);
    };
  };

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      getDecodedURL();
    };
  }, []);

  useEffect(() => {
    const animationPlayed = localStorage.getItem('animationPlayed');
    if (animationPlayed === 'true') {
      setVisibles(data);
      return;
    };

    // Mitigates overlapping animations
    const timeouts = [];
    data.forEach((letter, i) => {
      const delay = 500;
      const timeout = setTimeout(() => {
        setVisibles((prev) => [...prev, letter]);
        if (i === data.length - 1) localStorage.setItem('animationPlayed', 'true');
      }, i * delay);
      timeouts.push(timeout);
    });

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [data]);

  return (
    <>
      {loading && <span>Loading...</span>}
      {!loading &&
        <span>{visibles.map(letter => (<span>{letter}</span>))}</span>}
    </>
  );
};

export default App;

/*
https://github.com/jonnicwolf/Ramp-CTF-challenge

from selenium import webdriver
from selenium.webdriver.common.by import By

driver = webdriver.Chrome()

driver.get("https://tns4lpgmziiypnxxzel5ss5nyu0nftol.lambda-url.us-east-1.on.aws/challenge")

chars = []
class_attrs = []

sections = driver.find_elements(By.CSS_SELECTOR, 'section[data-id^="92"]')
for section in sections:
  articles = section.find_elements(By.CSS_SELECTOR, 'article[data-class$="45"]')
  for article in articles:
    divs = article.find_elements(By.CSS_SELECTOR, 'div[data-tag*="78"]')
    for div in divs:
      bs = div.find_elements(By.TAG_NAME, 'b')
      for b in bs:
          class_attr = b.get_attribute('class')
          class_attrs.append(class_attr)
          if class_attr == "ramp ref":
            value = b.get_attribute("value")
            if value:
              chars.append(value)

print('classes: ', class_attrs)

hidden_url = ''.join(chars)
print("url: ", hidden_url)

input("Enter to exit")
driver.quit()
*/
