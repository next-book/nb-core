import React from 'react';
import { reducer, IPeek } from './peeks-reducer';
import { IState as ICombinedState } from '../reducer';
import Peek from './peek';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

export interface IProps {
  peeks: IPeek[];
  addPeek(peek: IPeek): void;
  destroyPeek(index: number): void;
}

export class Peeks extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  private handleFootnoteDisplay = (event: Event) => {
    const target = event.target as HTMLAnchorElement;

    if (target.href) {
      const attrHref = target.getAttribute('href') || '';
      if (attrHref.startsWith('#fn:')) {
        event.preventDefault();

        const footnoteEl = document.getElementById(attrHref.replace(/^#/, ''));
        if (footnoteEl !== null)
          this.props.addPeek({
            content: footnoteEl.innerHTML,
            title: 'Footnote',
            source: target.href,
            showSource: false,
          });
      }
    }
  };

  componentDidMount() {
    window.addEventListener('click', this.handleFootnoteDisplay);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.handleFootnoteDisplay);
  }

  render() {
    return (
      <div className="peeks ui-target">
        {this.props.peeks.map((peek, index) => (
          <Peek
            key={index}
            index={index}
            source={peek.source}
            showSource={peek.showSource}
            title={peek.title}
            content={typeof peek.content !== 'string' ? peek.content : null}
            rawContent={typeof peek.content === 'string' ? peek.content : null}
            destroy={this.props.destroyPeek}
          />
        ))}
      </div>
    );
  }
}

const mapStateToProps = (state: ICombinedState) => {
  return { peeks: state.peeks };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return bindActionCreators(
    {
      addPeek: reducer.addPeek,
      destroyPeek: reducer.destroyPeek,
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Peeks);
