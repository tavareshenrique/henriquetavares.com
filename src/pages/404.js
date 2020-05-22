import React from 'react';
import Layout from '../components/Layout';

export default function NotFoundPage({ location }) {
  return (
    <Layout location={location}>
      <main>
        <h1>Not Found</h1>
        <p>Hey Coder, you are lost?</p>
        <iframe
          title="lost"
          width="560"
          height="315"
          src="https://www.youtube.com/embed/WpqUXd8XPmo"
          frameBorder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullscreen
        />
        <p>Ive been feeling lost lately...</p>
      </main>
    </Layout>
  );
}
