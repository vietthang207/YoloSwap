import React, { PureComponent } from 'react';
import Swap from '../swap/Swap';
import Market from '../market/Market';
import * as accountActions from "../../actions/accountAction";
import * as globalActions from "../../actions/globalAction";
import { connect } from "react-redux";
import * as scatterService from '../../services/scatter_service';
import Modal from '../commons/Modal';
import ModalScatter from '../commons/ModalScatter';
import appConfig from '../../config/app';

function mapStateToProps(state) {
  const global = state.global;

  return {
    isErrorActive: global.isErrorActive,
    errorType: global.errorType,
    errorMessage: global.errorMessage
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setScatterEos: (eos) => {dispatch(accountActions.setScatterEos(eos))},
    connectToScatter: (isLoadingNeeded, firstTimeConnect) => {dispatch(accountActions.connectToScatter(isLoadingNeeded, firstTimeConnect))},
    unsetGlobalError: () => {dispatch(globalActions.setGlobalError(false))},
  }
}

class Body extends PureComponent {
  constructor(props) {
    super(props);
    this.srcAmountRef = React.createRef();
  };

  componentWillMount = () => {
    const scatterJs = scatterService.initiateScatter();
    const eos = scatterService.getEosInstance(scatterJs.scatter);

    this.props.setScatterEos(eos);

    this.props.connectToScatter(false, true);

    document.addEventListener('scatterLoaded', () => {
      this.props.connectToScatter(false, true);
    });
  };

  render() {
    return (
      <div className={"body"}>
        <div className={"body__container container"}>
          <div className={"body__content"}>
            <div className={"body__title"}>Simple Just Became Instant</div>
            {/*<div className={"body__sub-title"}>Swap tokens without involving any intermediate token</div>*/}
          </div>
          <Swap srcAmountRef={this.srcAmountRef}/>
          <Market srcAmountRef={this.srcAmountRef}/>
          <Modal isActive={this.props.isErrorActive} handleClose={() => this.props.unsetGlobalError()} title="Error">
            <div className={"error-modal"}>
              {this.props.errorType !== appConfig.SCATTER_ERROR_TYPE && (
                <div className={"error-modal__message"}>{this.props.errorMessage}</div>
              )}

              {this.props.errorType === appConfig.SCATTER_ERROR_TYPE && (
                <ModalScatter/>
              )}
            </div>
          </Modal>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Body);
