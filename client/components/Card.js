import React from 'react';
import * as PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';

import CardImage from './CardImage';

const spinnerImage = '/images/spinner.gif';

export default class Card extends React.PureComponent {
  // eslint-disable-next-line no-unused-vars
  state = {
    img: spinnerImage
  };

  componentDidMount() {
    window.addEventListener('scroll', this.onScroll);
    window.addEventListener('resize', this.onScroll);
    this.onScroll();
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('resize', this.onScroll);
    clearTimeout(this.timer);
  }

  onScroll = () => {
    clearTimeout(this.timer);
    this.timer = setTimeout(this.checkVisibleAndOptionalLoadImage, 100);
  };

  checkVisibleAndOptionalLoadImage = () => {
    if (this.isVisible()) {
      this.setState({
        img: this.props.img
      });
    }
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.state.img !== prevState.img) {
      this.onScroll();
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (state.img !== props.img) {
      return {
        img: props.img
      };
    }

    // Return null to indicate no change to state.
    return null;
  }

  isVisible = () => {
    let book = this.book;

    if (book == null) {
      return false;
    }

    let top = book.offsetTop;
    const height = book.offsetHeight;

    while (book.offsetParent) {
      book = book.offsetParent;
      top += book.offsetTop;
    }

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    return top < scrollTop + window.innerHeight && top + height > scrollTop;
  };

  refRoot = domElement => {
    this.book = domElement;
  };

  static propTypes = {
    img: PropTypes.string,
    url: PropTypes.string,
    topText: PropTypes.string.isRequired,
    middleText: PropTypes.string,
    bottomText: PropTypes.string,
    elevation: PropTypes.number,
    displayMode: PropTypes.oneOf(['standard', 'compact', 'minimal']).isRequired,
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired
  };

  render() {
    const { url, topText, middleText, bottomText, displayMode, elevation, children } = this.props;
    const { img } = this.state;

    return (
      <span>
        <Paper elevation={elevation}>
          <div className="root" ref={this.refRoot}>
            <div className={`card card--${displayMode}`}>
              <div className="container">
                <div className="sub-container">
                  <div className="top-text-container">
                    <div className={`top-text top-text--${displayMode}`}>{topText}</div>
                  </div>
                  <div className="image-container">
                    <CardImage url={url} src={img} />
                  </div>
                  <div className="middle-text-container">
                    <div className={`middle-text middle-text--${displayMode}`}>
                      {middleText != null ? middleText : null}
                    </div>
                  </div>
                  {bottomText != null ? (
                    <div className="bottom-text-container">
                      <div className={`bottom-text bottom-text--${displayMode}`}>{bottomText}</div>
                    </div>
                  ) : null}
                  <div className="controls-container">
                    <div className="controls">{children != null ? children : null}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Paper>
        <style jsx>{`
          .root {
            position: relative;
          }
          .card {
            position: relative;
          }
          .card--standard {
            padding-top: 133%;
          }
          .card--compact {
            padding-top: 100%;
          }
          .card--minimal {
            padding-top: 75%;
          }
          .container {
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
          }
          .sub-container {
            display: table;
            width: 100%;
            height: 100%;
          }
          .top-text-container {
            display: table-row;
          }
          .top-text {
            text-align: center;
            display: table-cell;
            padding: 15px;
            font-size: 16px;
          }
          .top-text--minimal {
            font-size: 13px;
          }
          .image-container {
            display: table-row;
          }
          .bottom-text-container {
            display: table-row;
          }
          .bottom-text {
            display: table-cell;
            padding: 0 15px;
            text-align: center;
            font-size: 16px;
          }
          .bottom-text--minimal {
            font-size: 13px;
          }
          .middle-text-container {
            display: table-row;
          }
          .middle-text {
            display: table-cell;
            text-align: center;
            color: #666;
            font-size: 12px;
            padding: 10px 15px;
          }
          .middle-text--minimal {
            font-size: 9px;
          }
          .controls-container {
            display: table-row;
          }
          .controls {
            display: table-cell;
            text-align: center;
            padding: 10px 0;
          }
        `}</style>
      </span>
    );
  }
}
