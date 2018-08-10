import React, { Component } from "react";
import { Meteor } from "meteor/meteor";
import { render } from "react-dom";
import { createContainer } from "react-meteor-data";
import { Link } from "react-router-dom";
import { updateSideBarVisible, updateLoginModalVisible } from "../../../Actions";
import { connect } from "react-redux";
import globalStyles from "../../../../config/globalStyles";
import { combineStyles, isNumber } from "../../../../config/helpers";
import styles from "./styles";
import MdSearch from "react-icons/lib/md/search";
import FaClose from 'react-icons/lib/fa/close'
import FaShoppingCart from "react-icons/lib/fa/shopping-cart";
import MdMenu from "react-icons/lib/md/menu";
import Grid from 'material-ui/Grid';
import Hidden from 'material-ui/Hidden';
import Drawer from "material-ui/Drawer";
import IconButton from "material-ui/IconButton";
import Badge from "material-ui/Badge";
import Button from 'material-ui/Button';
import LoginForm from "../LoginForm";
import { appName } from "../../../../config/globalConsts";
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cartItemsCount: 0,
      value: "",
      suggestions: [],
      modalVisible: false,
      loadingBtn: false,
      showAlert: false,
      alertMessage: "",
      zipCode: "",
      zipCodeAllowed: false,
      checkedZipCode: false,
      joinedWaitList: false,
      email: "",
      scrollY: 0,
      isScrollingUp: true,
    };
    this.setModalVisible = this.setModalVisible.bind(this);
    this.setSideBarVisible = this.setSideBarVisible.bind(this);
    this.handleError = this.handleError.bind(this);
    this.handleOnKeyDownJoin = this.handleOnKeyDownJoin.bind(this);
    this._isMounted = false;
    this.handleScroll = this.handleScroll.bind(this);
  }
  componentWillMount() {
    this._isMounted = true;
  }
  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
  }
  componentWillUnmount() {
    this._isMounted = false;
    window.removeEventListener("scroll", this.handleScroll);
  }
  handleScroll(e) {
    if (this._isMounted) {
      let isScrollingUp = false;
      if (this.state.scrollY > window.pageYOffset) {
        isScrollingUp = true;
      }
      this.setState({
        scrollY: window.pageYOffset,
        isScrollingUp: isScrollingUp,
      });
    }
  }

  handleError(alertMessage) {
    this.setState({ alertMessage, showAlert: !this.state.showAlert });
  }
  handleOnKeyDownJoin(event) {
    if (event.keyCode == 13 && event.shiftKey == false) {
      this.joinWaitList();
    }
  }
  joinWaitList() {
    const { zipCodeAllowed, email, zipCode } = this.state;
    if (isNumber(zipCode) && zipCode.length === 5) {
      if (!zipCodeAllowed) {
        Meteor.call("joinWaitList", { email, zipCode }, (err, res) => {
          if (res && this._isMounted) {
            this.setState({ joinedWaitList: !this.state.joinedWaitList });
          }
        });
      }
    } else {
      this.handleError("Please, enter a valid US zip code!");
    }
  }

  setModalVisible() {
    const { doUpdateLoginModalVisible, loginModalVisible } = this.props;
    doUpdateLoginModalVisible(!loginModalVisible);
  }

  renderLeft() {
    return (
      <Hidden only={['xs']}>
        <Grid
          item
          sm={3}
          md={3}
          lg={3}
          xl={3}
          style={combineStyles([
            globalStyles.noMarginPadding,
            globalStyles.center,
            styles.contSearch,
          ])}
        >
          <Link to="/">
            <p
              style={combineStyles([
                globalStyles.textBig,
                globalStyles.textCenter,
                globalStyles.textBlack,
                globalStyles.textBold6,
                { paddingLeft: 8 },
              ])}
            >
              {appName}
            </p>
          </Link>
        </Grid>
      </Hidden>
    );
  }
  renderMessage() {
    return (
      <Grid
        item
        sm={4}
        md={4}
        lg={4}
        style={combineStyles([styles.contName, globalStyles.center])}
      >
        <p
          style={combineStyles([
            globalStyles.textCenter,
            globalStyles.textMid,
            globalStyles.textBold5,
          ])}
        >
          Free delivery + Pick up returns
        </p>
      </Grid>
    );
  }
  renderRight() {
    const { cartItemsCount, userId } = this.props;
    return (
      <Grid
        item
        sm={8}
        md={6}
        lg={4}
        style={combineStyles([
          styles.contMenus,
          globalStyles.center,
          { zIndex: 100, justifyContent: "flex-end", paddingRight: 20 },
        ])}
      >
        {userId
          ? <div style={styles.contMenuItem}>
              <Link className="menu" to="/shop/orders" style={styles.textMenu}>
                Orders
              </Link>
            </div>
          : null}
        <div style={styles.contMenuItem}>
          {userId
            ? <a
                className="menu"
                href=""
                style={styles.textMenu}
                onClick={event => {
                  event.preventDefault();
                  Meteor.logout();
                }}
              >
                Logout
              </a>
            : <div
                onClick={() => {
                  this.setState({ signUp: false });
                  this.setModalVisible();
                }}
              >
                <p className="menu" style={styles.textMenu}>
                  Log In
                </p>
              </div>}
        </div>
        <div style={styles.contMenuItem}>
          {!userId ?
            <div
              onClick={() => {
                this.setState({ signUp: true });
                this.setModalVisible();
              }}
            >
              <p className="menu" style={styles.textMenu}>
                Register
              </p>
            </div>
            :
            null
          }
        </div>
        { userId ?
          <Link to="/shop/cart/">
            <Badge badgeContent={0} color="primary">
              <FaShoppingCart size={22} style={styles.iconCart} />
            </Badge>
          </Link>
          :
          <div
            style={styles.contMenuItem}
            onClick={() => {
              if (userId) {
                this.props.history.push("/shop/cart/");
              } else {
                this.setModalVisible();
              }
            }}
          >
            <FaShoppingCart size={22} style={styles.iconCart} />
          </div>
        }
      </Grid>
    );
  }
  renderCartMobile() {
    const { userId } = this.props;
    return (
      <Grid
        item
        xs={2}
        style={combineStyles([
          globalStyles.noMarginPadding,
          globalStyles.center,
        ])}
        onClick={() => {
          if (userId) {
            this.props.history.push("/shop/cart/");
          } else {
            this.setModalVisible();
          }
        }}
      >
        <div>
          { userId ?
            <Badge badgeContent={0} color="primary">
              <FaShoppingCart size={23} style={styles.iconCart} />
            </Badge>
            :
            <FaShoppingCart size={25} style={styles.iconCart} />
          }
        </div>
      </Grid>
    );
  }

  renderModalLogin() {
    const { userId, loginModalVisible } = this.props;
    const { signUp } = this.state;
    if (!userId) {
      return (
        <div>
          <Hidden only='xs'>
            <Dialog open={loginModalVisible} onRequestClose={this.setModalVisible}>
              <DialogContent style={{ minWidth: 400 }}>
                <LoginForm signUp={signUp} />
              </DialogContent>
              <DialogActions>
                <Button onClick={this.setModalVisible} color="primary">
                  Close
                </Button>
              </DialogActions>
            </Dialog>
          </Hidden>
          <Hidden only={['sm', 'md', 'lg', 'xl']}>
            <Dialog fullScreen open={loginModalVisible} onRequestClose={this.setModalVisible}>
              <DialogTitle onClick={this.setModalVisible}><FaClose /></DialogTitle>
              <DialogContent>
                <LoginForm signUp={signUp} />
              </DialogContent>
              <DialogActions>
                <Button onClick={this.setModalVisible} color="primary">
                  Close
                </Button>
              </DialogActions>
            </Dialog>
          </Hidden>
        </div>

      )
    }
    return null;
  }


  renderSearchMobile() {
    return (
      <Grid
        item
        xs={2}
        style={combineStyles([
          globalStyles.center,
          globalStyles.noMarginPadding,
          { justifyContent: "flex-end" },
        ])}
      >
        <IconButton
          disableRipple={true}
          onClick={() => {
            this.setSideBarVisible();
            const { history } = this.props;
            const isProductsPage =
              history.location.pathname.indexOf("products") > -1;
            if (!isProductsPage) {
              this.props.history.push("/shop/products");
            }
          }}
        >
          <MdSearch size={25} />
        </IconButton>
      </Grid>
    );
  }

  setSideBarVisible() {
    const { doUpdateSideBarVisible, sideBarVisible } = this.props;
    doUpdateSideBarVisible(!sideBarVisible);
  }

  renderLeftBtn() {
    const { history } = this.props;
    return (
      <Grid
        item
        xs={2}
        style={combineStyles([
          globalStyles.noMarginPadding,
          globalStyles.center,
        ])}
      >
        <div
          onClick={() => {
            this.setSideBarVisible();
          }}
        >
          <IconButton
            disableRipple={true}
            style={globalStyles.center}
          >
            <MdMenu size={26} />
          </IconButton>
        </div>
      </Grid>
    );
  }
  renderBigScreen() {
    return (
      <Hidden only={['xs']}>
        <Grid
          container
          style={combineStyles([globalStyles.noMarginPadding])}
          justify={'space-between'}
        >
          {this.renderLeft()}
          {this.renderRight()}
        </Grid>
      </Hidden>
    )
  }
  renderSmallScreen() {
    return (
      <Hidden only={['sm', 'md', 'lg', 'xl']}>
        <Grid
          container
          style={combineStyles([styles.contGridMenu, globalStyles.center])}
        >
          {this.renderLeftBtn()}
          <Grid
            item
            xs={6}
            style={combineStyles([
              globalStyles.center,
              globalStyles.noMarginPadding,
              { height: '100%' }
            ])}
          >
            <Link to="/">
              <div
                style={combineStyles([
                  globalStyles.center,
                  { height: "100%", cursor: "pointer" },
                ])}
                onClick={() => {
                  //this.props.history.push("/");
                }}
              >
                <p
                  style={combineStyles([
                    globalStyles.textBig,
                    globalStyles.textMavenPro,
                    globalStyles.textCenter,
                    globalStyles.textMavenPro,
                    globalStyles.textBlack,
                    globalStyles.textBold6,
                    { paddingLeft: 8 },
                  ])}
                >
                  {appName}
                </p>
              </div>
            </Link>
          </Grid>
          {this.renderCartMobile()}
        </Grid>
      </Hidden>
    )
  }
  render() {
    return (
      <Grid
        container
        style={combineStyles([
          globalStyles.noMargin,
          globalStyles.noPadding,
          styles.row,
          styles.cont,
        ])}
        justify='center'
        align='center'
      >
        <img src="images/header-home-bg.png"/>
        <Drawer
          docked={false}
          width={250}
          open={this.props.sideBarVisible}
          onRequestChange={open => this.props.doUpdateSideBarVisible(open)}
        >
          <div>Drawer</div>
        </Drawer>
        {this.renderModalLogin()}
        {this.renderBigScreen()}
        {this.renderSmallScreen()}
        <Dialog
          open={this.state.showAlert}
          onRequestClose={() => {
            this.setState({ showAlert: !this.state.showAlert })
          }}
        >
          <DialogContent style={{ minWidth: 400 }}>
            <DialogContentText>
              {this.state.alertMessage}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                this.setState({ showAlert: !this.state.showAlert })
              }}
              color="primary"
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    );
  }
}

const MeteorNav = createContainer(() => {
  const userId = Meteor.userId();
  return {
    userId,
  };
}, Navbar);

const mapStateToProps = (state) => {
  const { reducers } = state;
  const { sideBarVisible, loginModalVisible } = reducers;
  return { sideBarVisible, loginModalVisible };
};

const mapDispatchToProps = (dispatch) => {
  return {
    doUpdateSideBarVisible: (sideBarVisible) => {
      dispatch(updateSideBarVisible(sideBarVisible));
    },
    doUpdateLoginModalVisible: (loginModalVisible) => {
      dispatch(updateLoginModalVisible(loginModalVisible));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MeteorNav);