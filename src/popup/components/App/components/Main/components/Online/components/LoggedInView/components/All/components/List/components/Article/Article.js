import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { postsDelete } from 'redux-popup/actions/posts';
import './Article.css';

class Article extends Component {
  state={
    deleteActive: false,
    deleteConfirmed: false,
  }

  render() {
    const {
      privatePost,
      unread,
      href,
      description,
      extended,
      time,
      tags,
    } = this.props;

    const timeFormated = time.substring(0, 10).replace(/-/g, '.');
    const tagsFormated = tags.split(' ').map(tag => `#${tag}`).join(' ');
    const { deleteActive, deleteConfirmed } = this.state;

    return (
      <article className={`article ${privatePost ? 'article--private' : ''}`}>
        {
          deleteConfirmed && (
            <div className="article__loading">
              <div className="article__loading-icon" />
            </div>
          )
        }
        <a
          tabIndex={deleteConfirmed ? '-1' : '0'}
          className={`article__url ${unread ? 'article__url--unread' : ''}`}
          href={decodeURIComponent(href)}
          rel="noopener noreferrer"
          target="_blank"
        >
          {description}
        </a>
        <div className="article__meta">
          <div className="article__info">{timeFormated}</div>
          {tags ? <div className="article__info article__info--tags">{tagsFormated}</div> : ''}
          <div className="article__info">
            {deleteActive && (
              <>
                <span className="article__info--cancel" onClick={this.handleCancelClick}>{chrome.i18n.getMessage('popupArticleButtonCancel')}</span>
                <span className="article__info--separator">/</span>
              </>
            )}
            {!deleteConfirmed && (
              <span className="article__info--delete" onClick={this.handleDeleteClick}>{chrome.i18n.getMessage('popupArticleButtonDelete')}</span>
            )}
          </div>
        </div>
      </article>
    );
  }

  handleDeleteClick = () => {
    const { href, description, extended, postsDelete } = this.props;
    if (this.state.deleteActive) {
      this.setState({
        deleteConfirmed: true,
      });
      postsDelete(href, description, extended);
    }

    this.setState(state => {
      return {
        deleteActive: !state.deleteActive,
      };
    });
  }

  handleCancelClick = () => {
    this.setState(state => {
      return {
        deleteActive: !state.deleteActive,
      };
    });
  }
}

Article.propTypes = {
  privatePost: PropTypes.bool.isRequired,
  unread: PropTypes.bool.isRequired,
  href: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  extended: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  tags: PropTypes.string.isRequired,
  postsDelete: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  postsDelete: (href, title, description) => dispatch(postsDelete(href, title, description)),
});

export default connect(null, mapDispatchToProps)(Article);
