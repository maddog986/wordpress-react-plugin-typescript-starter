import * as React from "react";
import {
  Button,
  Card,
  Container,
  Form,
  InputGroup,
  Navbar,
} from "react-bootstrap";
import { useGlobal } from "../../store";
import { setLoading, updateState } from "../../store/actions";
import { Profile } from "../../store/types";
import wp from "../../utils/wpapi";

const App = () => {
  const { state, dispatch } = useGlobal();

  React.useEffect(() => {
    // use wpapi to get the users profile
    wp.users()
      .me()

      // save profile to state
      .then((res: Profile) => dispatch(updateState("profile", res)))

      // no longer loading
      .then(() => dispatch(setLoading(false)));
  }, []);

  if (state.loading) return <div>Loading...</div>;

  return (
    <div>
      <Navbar expand="lg" variant="light" bg="light" className="shadow">
        <Navbar.Brand>Settings</Navbar.Brand>
        <Navbar.Text className="w-100 text-right">
          WordPress Starter React Admin
        </Navbar.Text>
      </Navbar>

      <Container className="py-5">
        <Card className="card shadow mb-4">
          <Card.Header as="h6" className="font-weight-bold text-primary">
            Admin Settings
          </Card.Header>

          {/* <div className="card-header py-3">
            <h6 className="m-0 font-weight-bold text-primary">
              Admin Settings
            </h6>
          </div> */}

          <Card.Body>
            <Form>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Consumer Key</Form.Label>
                <InputGroup className="mb-3">
                  <Form.Control type="text" placeholder="" />
                  <InputGroup.Append>
                    <Button variant="warning">Button</Button>
                  </InputGroup.Append>
                </InputGroup>
                <Form.Text className="text-muted">
                  <a href="#">Generate New Token</a> Only do this if instructed
                  or Access Token did not get renewed properly.
                </Form.Text>
              </Form.Group>

              <Form.Group controlId="formBasicPassword">
                <Form.Label>Consumer Secret</Form.Label>
                <Form.Control type="text" placeholder="" />
              </Form.Group>

              <Form.Group controlId="formBasicCheckbox">
                <Form.Check type="checkbox" label="Resend Confirmation" />
                <Form.Text>
                  If someone signs up twice, resend them another email
                  confirmation.
                </Form.Text>
              </Form.Group>

              <Form.Group controlId="formBasicPassword">
                <Form.Label>Failure Emails</Form.Label>
                <Form.Control type="text" placeholder="" />
                <Form.Text className="text-muted">
                  Who to send any API failure noties. Separate additional emails
                  by a semicolon (;)
                </Form.Text>
              </Form.Group>

              <Button variant="primary" type="submit">
                Save Settings
              </Button>
            </Form>
          </Card.Body>
        </Card>

        <div className="text-muted ml-3 mr-3">
          Next Access Token automatically renews within the next 31 minutes and
          20 seconds
        </div>
      </Container>
    </div>
  );
};

// export default App;
export default App;
