import React from 'react';
import { Link, navigate } from 'gatsby';
import Toggle from './Toggle';
import Helmet from 'react-helmet';

import { rhythm, scale } from '../utils/typography';
import sun from '../assets/sun.png';
import moon from '../assets/moon.png';
import brazil from '../assets/brazil.png';
import usa from '../assets/usa.png';

class Layout extends React.Component {
  state = {
    theme: null,
    languageCheck: false,
  };

  componentDidMount() {
    this.setState({ theme: window.__theme });
    window.__onThemeChange = () => {
      this.setState({ theme: window.__theme });
    };
  }

  setLanguage = () => {
    const { languageCheck } = this.state;

    this.setState(
      {
        languageCheck: !languageCheck,
      },
      () => {
        console.log(this.state.languageCheck);
        this.state.languageCheck ? navigate('/') : navigate('/en');
      }
    );
  };

  renderHeader() {
    const { location, title } = this.props;
    const rootPath = `${__PATH_PREFIX__}/`;

    if (location.pathname === rootPath) {
      return (
        <h1
          style={{
            ...scale(0.75),
            marginBottom: 0,
            marginTop: 0,
          }}
        >
          <Link
            style={{
              boxShadow: 'none',
              textDecoration: 'none',
              color: 'var(--textTitle)',
            }}
            to={'/'}
          >
            {title}
          </Link>
        </h1>
      );
    } else {
      return (
        <h3
          style={{
            fontFamily: 'Montserrat, sans-serif',
            marginTop: 0,
            marginBottom: 0,
            height: 42, // because
            lineHeight: '2.625rem',
          }}
        >
          <Link
            style={{
              boxShadow: 'none',
              textDecoration: 'none',
              color: '#d1c03f',
            }}
            to={'/'}
          >
            {title}
          </Link>
        </h3>
      );
    }
  }
  render() {
    const { children } = this.props;
    const { languageCheck } = this.state;

    return (
      <div
        style={{
          color: 'var(--textNormal)',
          background: 'var(--bg)',
          transition: 'color 0.2s ease-out, background 0.2s ease-out',
          minHeight: '100vh',
        }}
      >
        <Helmet
          meta={[
            {
              name: 'theme-color',
              content: this.state.theme === 'light' ? '#ffa8c5' : '#282c35',
            },
          ]}
        />
        <div
          style={{
            marginLeft: 'auto',
            marginRight: 'auto',
            maxWidth: rhythm(24),
            padding: `2.625rem ${rhythm(3 / 4)}`,
          }}
        >
          <header
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '2.625rem',
            }}
          >
            {this.renderHeader()}
            {this.state.theme !== null ? (
              <Toggle
                icons={{
                  checked: (
                    <img
                      src={brazil}
                      width="16"
                      height="16"
                      role="presentation"
                      style={{ pointerEvents: 'none' }}
                    />
                  ),
                  unchecked: (
                    <img
                      src={usa}
                      width="16"
                      height="16"
                      role="presentation"
                      style={{ pointerEvents: 'none' }}
                    />
                  ),
                }}
                checked={this.state.theme === navigate('/')}
                onChange={this.setLanguage}
              />
            ) : (
              <div style={{ height: '24px' }} />
            )}
          </header>
          {children}
        </div>
      </div>
    );
  }
}

export default Layout;