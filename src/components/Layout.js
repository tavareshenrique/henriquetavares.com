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
    this.setState({ theme: 'dark' });
    window.__onThemeChange = () => {
      this.setState({ theme: 'dark' });
    };
  }

  componentDidUpdate(_, prevState) {
    const { location, blogPost } = this.props;

    if (prevState.languageCheck !== this.state.languageCheck) {
      if (blogPost) {
        const path = String(location.pathname);
        const pathRes = path.split('/');

        if (this.state.languageCheck && pathRes[2] !== '') {
          const pathUrl = pathRes[2];
          navigate(`/${pathUrl}`);
        } else {
          let pathUrl = '';
          if (pathRes[1] === 'pt-br') {
            pathUrl = pathRes[2];
          } else {
            pathUrl = pathRes[1];
          }
          navigate(`/pt-br/${pathUrl}`);
        }
      } else {
        if (this.state.languageCheck) {
          navigate('/en');
        } else {
          navigate('/');
        }
      }
    }
  }

  setLanguage = () => {
    const { languageCheck } = this.state;

    this.setState({ languageCheck: !languageCheck });
  };

  renderHeader() {
    const { location, title } = this.props;
    const rootPath = `${__PATH_PREFIX__}/`;
    const rootPathEn = `${__PATH_PREFIX__}/en`;

    if (location.pathname === rootPath || location.pathname === rootPathEn) {
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
    const { children, lang, location } = this.props;

    console.log(location);

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
              content: '#282c35',
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
                      src={usa}
                      width="16"
                      height="16"
                      role="presentation"
                      style={{ pointerEvents: 'none' }}
                    />
                  ),
                  unchecked: (
                    <img
                      src={brazil}
                      width="16"
                      height="16"
                      role="presentation"
                      style={{ pointerEvents: 'none' }}
                    />
                  ),
                }}
                checked={lang !== 'pt-br'}
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
