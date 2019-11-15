import React, { Component } from "react";
import "./App.css";
import { Form, FormGroup, Input, Button, Col } from "reactstrap";
import { Modal, Container, Row, Card } from "react-bootstrap";
import io from "socket.io-client";

class App extends Component {
  socket = null;
  constructor(props) {
    super(props);

    this.state = {
      message: "",
      messages: [],
      username: "",
      showModal: false
    };
  }

  componentDidMount() {
    const connectionOpts = {
      transports: ["websocket"]
    };

    this.socket = io("http://localhost:3000/", connectionOpts);

    this.socket.on("message", a => {
      this.setState(
        {
          messages: this.state.messages.concat(a)
        },
        () => {
          // window.scroll(0, document.body.scrollHeight);
          // document.body.scrollTop = document.body.scrollHeight
          console.log(this.state.messages);
        }
      );
    });
  }

  onMessageChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  sendMessage = async e => {
    e.preventDefault();
    await this.socket.emit("sendMessage", {
      username: this.state.username,
      message: this.state.message
    });
    this.setState({
      message: ""
    });
  };

  toggleModal = () => {
    this.setState({ showModal: true });
  };

  componentDidUpdate = () => {
    var chat = document.querySelector(".ex1");
    chat.scrollTop = chat.scrollHeight;
  };

  render() {
    return (
      <div>
        <Card className="text-center mt-5">
          <Card.Header>Messanger</Card.Header>
          <Card.Body>
            <Button variant="primary" onClick={this.toggleModal}>
              Access chat
            </Button>
          </Card.Body>
          <Card.Footer className="text-muted"></Card.Footer>
        </Card>

        <Modal
          show={this.state.showModal}
          onHide={() => {
            this.setState({ showModal: false });
          }}
          className="area"
        >
          <Modal.Header closeButton>
            <Modal.Title className="area">Chat Messanger</Modal.Title>
          </Modal.Header>
          <Modal.Body className="modal2">
            <Container>
              <Row className="show-grid">
                <Col className="ex1" xs={12} md={12}>
                  <code>
                    <Card className="cardTitle">
                      {this.state.messages.map((msg, index) => (
                        <Card.Body key={index}>
                          <Card.Title>
                            <hr />
                            {msg.username}
                          </Card.Title>
                          <Card.Text>{msg.message}</Card.Text>
                        </Card.Body>
                      ))}
                    </Card>
                  </code>
                </Col>
              </Row>
              {/* ROW 2 */}
              <Row className="show-grid">
                <Col xs={12} md={12}>
                  <code>
                    <Form onSubmit={this.sendMessage}>
                      <FormGroup>
                        <Input
                          type="text"
                          placeholder="username"
                          autoComplete="off"
                          name="username"
                          value={this.state.username}
                          onChange={this.onMessageChange}
                        />
                        <Input
                          type="text"
                          placeholder="write a message..."
                          autoComplete="off"
                          name="message"
                          value={this.state.message}
                          onChange={this.onMessageChange}
                        />
                      </FormGroup>
                      <Button>Send</Button>
                    </Form>
                  </code>
                </Col>
              </Row>
            </Container>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}

export default App;
