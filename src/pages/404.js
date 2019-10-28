import React from 'react';
import Layout from '../components/Layout';

class NotFoundPage extends React.Component {
  render() {
    return (
      <Layout location={this.props.location}>
        <main>
          <h1>Not Found</h1>
          <p>Hey Coder, you're lost?</p>
          <iframe
            width={window.innerWidth - 1000}
            height="315"
            src="https://www.youtube.com/embed/WpqUXd8XPmo"
            frameborder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullscreen
          />
          <p>I've been feeling lost lately...</p>
        </main>
      </Layout>
    );
  }
}

export default NotFoundPage;
