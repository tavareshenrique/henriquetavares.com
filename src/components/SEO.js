import React from 'react';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import { StaticQuery, graphql } from 'gatsby';

const query = graphql`
  query GetSiteMetadata {
    site {
      siteMetadata {
        title
        author
        description
        siteUrl
        social {
          twitter
        }
      }
    }
  }
`;

function SEO({ meta, image, title, description, slug, lang = 'pt-br' }) {
  return (
    <StaticQuery
      query={query}
      render={(data) => {
        const { siteMetadata } = data.site;
        const metaDescription = description || siteMetadata.description;
        const metaImage = image; /* ? `${siteMetadata.siteUrl}/${image}` : null; */
        const url = `${siteMetadata.siteUrl}${slug}`;
        return (
          <Helmet>
            {/* htmlAttributes */}
            <title>{siteMetadata.title} — think different.</title>

            <meta name="description" content={metaDescription} />
            <meta name="og:url" content={url} />
            <meta name="og:title" content={title || siteMetadata.title} />
            <meta name="og:description" content={metaDescription} />
            <meta name="twitter:card" content="summary" />
            <meta
              name="twitter:creator"
              content={siteMetadata.social.twitter}
            />
            <meta name="twitter:title" content={title || siteMetadata.title} />
            <meta name="twitter:description" content={metaDescription} />

            <metaImage property="og:image" content={metaImage} />
            <metaImage property="og:image:url" content={metaImage} />
            <metaImage property="og:image:type" content="image / jpeg" />
            <metaImage property="og:image:width" content={400} />
            <metaImage property="og:image:height" content={300} />
            <metaImage property="twitter:image" content={metaImage} />
          </Helmet>
        );
      }}
    />
  );
}

// SEO.defaultProps = {
//   meta: [],
//   title: '',
//   slug: '',
// };

// SEO.propTypes = {
//   description: PropTypes.string,
//   image: PropTypes.string,
//   meta: PropTypes.array,
//   slug: PropTypes.string,
//   title: PropTypes.string.isRequired,
// };

export default SEO;
