import React from 'react';
import profilePic from '../assets/profile-pic.jpg';
import { rhythm } from '../utils/typography';

class Bio extends React.Component {
  render() {
    const { lang } = this.props;

    const bioPTBr =
      'sou um desenvolvedor apaixonado por Javascript e por todo o ecossistema em torno desta tecnologia, com foco em ReactJS, React Native e NodeJS.';
    const bioEn =
      "i'm a developer in love about Javascript and the entire ecosystem surrounding this technology, focusing on ReactJS, React Native and NodeJS.";

    return (
      <div
        style={{
          display: 'flex',
          marginBottom: rhythm(2),
        }}
      >
        <img
          src={profilePic}
          alt="Henrique Tavares"
          style={{
            marginRight: rhythm(1 / 2),
            marginBottom: 0,
            width: rhythm(2),
            height: rhythm(2),
            borderRadius: '50%',
          }}
        />
        <span style={{ maxWidth: 500 }}>
          <a href="https://github.com/tavareshenrique">Henrique Tavares</a>{' '}
          <p>{lang === 'pt-br' ? bioPTBr : bioEn}</p>{' '}
        </span>
      </div>
    );
  }
}

export default Bio;
