/*
 * @Author: Vir Desai 
 * @Date: 2018-04-30 13:20:10 
 * @Last Modified by:   Vir Desai 
 * @Last Modified time: 2018-04-30 13:20:10 
 */

import React from 'react';
import PropTypes from 'prop-types';
import {
    Row,
    Col,
    Card,
    Form,
    Label,
    Alert,
    Input,
    Button,
    CardBody,
    FormGroup,
    CardHeader,
} from 'reactstrap';
import { Link, withRouter } from 'react-router-dom';
import Loading from './Loading';

class ForgotPassword extends React.Component {
  static propTypes = {
      member: PropTypes.shape({
          mail: PropTypes.string,
      }),
      error:        PropTypes.string,
      loading:      PropTypes.bool.isRequired,
      onFormSubmit: PropTypes.func.isRequired,
      history:      PropTypes.shape({
          push: PropTypes.func.isRequired,
      }).isRequired,
  }

  static defaultProps = {
      error:  null,
      member: {},
  }

  constructor(props) {
      super(props);
      this.state = {
          email: (props.member && props.member.email) ? props.member.email : '',
      };

      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange = (event) => {
      this.setState({
          ...this.state,
          [event.target.name]: event.target.value,
      });
  }

  handleSubmit = (event) => {
      event.preventDefault();
      this.props.onFormSubmit(this.state)
          .then(() => this.props.history.push('/login'))
          .catch(e => console.log(`Error: ${e}`));
  }

  render() {
      const { loading, error } = this.props;

      // Loading
      if (loading) {
          return <Loading />;
      }

      return (
          <div>
              <Row>
                  <Col lg={{ size: 6, offset: 3 }}>
                      <Card>
                          <CardHeader>Forgot Password</CardHeader>
                          <CardBody>
                              {!!error && <Alert color='danger'>{error}</Alert>}
                              <Form onSubmit={this.handleSubmit}>
                                  <FormGroup>
                                      <Label for='email'>Email</Label>
                                      <Input
                                          type='email'
                                          name='email'
                                          id='email'
                                          placeholder='example@email.com'
                                          value={this.state.email}
                                          onChange={this.handleChange}
                                      />
                                  </FormGroup>
                                  <Button color='primary'>Reset Password</Button>
                              </Form>

                              <hr />

                              <Row>
                                  <Col sm='6'>
                                    Need an account? <Link to='/sign-up'>Sign Up</Link>
                                  </Col>
                                  <Col sm='6' className='text-right'>
                                      <Link to='/login'>Login</Link> to your account.
                                  </Col>
                              </Row>
                          </CardBody>
                      </Card>
                  </Col>
              </Row>
          </div>
      );
  }
}

export default withRouter(ForgotPassword);
