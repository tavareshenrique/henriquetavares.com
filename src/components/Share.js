import React from 'react';
import PropTypes from 'prop-types';
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaRedditAlien,
  FaWhatsapp,
} from 'react-icons/fa';
import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  RedditShareButton,
} from 'react-share';

import './Share.scss';

const Share = ({ socialConfig, tags }) => (
  <div className="post-social">
    <FacebookShareButton
      url={socialConfig.config.url}
      className="button is-outlined is-rounded facebook"
    >
      <span className="icon">
        <FaFacebookF size={15} color={'#3b5998'} />
        {''}
      </span>
      <span className="text">Facebook</span>
    </FacebookShareButton>
    <TwitterShareButton
      url={socialConfig.config.url}
      className="button is-outlined is-rounded twitter"
      title={socialConfig.config.title}
      via={socialConfig.config.twitter.split('@').join('')}
      hashtags={tags}
    >
      <span className="icon">
        <FaTwitter size={15} color={'#1da1f2'} />
        {''}
      </span>
      <span className="text">Twitter</span>
    </TwitterShareButton>
    <LinkedinShareButton
      url={socialConfig.config.url}
      className="button is-outlined is-rounded linkedin"
      title={socialConfig.config.title}
    >
      <span className="icon">
        <FaLinkedinIn size={15} color={'#0077b5'} />
        {''}
      </span>
      <span className="text">LinkedIn</span>
    </LinkedinShareButton>
    <RedditShareButton
      url={socialConfig.config.url}
      className="button is-outlined is-rounded reddit"
      title={socialConfig.config.title}
    >
      <span className="icon">
        <FaRedditAlien size={15} color={'#ff4500'} />
        {''}
      </span>
      <span className="text">Reddit</span>
    </RedditShareButton>
    <WhatsappShareButton
      url={socialConfig.config.url}
      className="button is-outlined is-rounded whatsapp"
      title={socialConfig.config.title}
    >
      <span className="icon">
        <FaWhatsapp size={15} color={'#128c7e'} />
        {''}
      </span>
      <span className="text">WhatsApp</span>
    </WhatsappShareButton>
  </div>
);

Share.propTypes = {
  socialConfig: PropTypes.shape({
    twitter: PropTypes.string,
    config: PropTypes.shape({
      url: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    }),
  }).isRequired,
  tags: PropTypes.arrayOf(PropTypes.string),
};
Share.defaultProps = {
  tags: [],
};

export default Share;
