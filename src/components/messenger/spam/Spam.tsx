import React, { PureComponent } from "react";
import { asyncForEach, regionOptions } from "../../../utils/helper";
import { connect } from "react-redux";
import { asyncSendMessage } from "../../../store/telegram/saga";

const mapStateToProps = (state: any, ownProps: any) => {
  return {
    region: state.region.region
  };
};

@((connect as any)(mapStateToProps, null))
export class Spam extends PureComponent<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      value: "undefine"
    };
  }

  handleChange = (event) => {
    this.setState({ value: event.target.value });
  };
  handleMessageChange = (event) => {
    this.setState({ message: event.target.value });
  };

  handleSubmit = async (event) => {
    if (this.state.message === "") {
      return;
    }
    const chatFilterByRegion = this.props.region.filter((item) => {
      return this.state.value === item.reigon;
    });
    console.log(chatFilterByRegion);
    await asyncForEach(chatFilterByRegion, async (item) => {
      await this.sendMessage(item.chatId, this.state.message);
    });

    event.preventDefault();
  };

  sendMessage = async (chatId, message) => {
    console.log(chatId,message)
    try {
      // const content = {
      //   '@type': 'inputMessageText',
      //   text: {
      //     '@type': 'formattedText',
      //     text: message,
      //     entities: null
      //   },
      //   disable_web_page_preview: false,
      //   clear_draft: true
      // };
      // const { payload } = await asyncSendMessage({
      //   "@type": "sendMessage",
      //   chat_id:chatId,
      //   input_message_content: content
      // });
      // const { data } = payload;
      // console.log(data);
    } catch (e) {
    }
  };

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit} style={{ display: "grid", width: "30%" }}>
          <label>
            Message:
          </label>
          <textarea style={{ height: 300 }} value={this.state.message} onChange={this.handleMessageChange}/>
          <div style={{ height: 20 }}/>
          <select value={this.state.value} onChange={this.handleChange}>
            {regionOptions.map((option: any) => {
              return <option value={option.value}>{option.title}</option>;
            })}
          </select>
          <div style={{ height: 20 }}/>
          <button type="submit" value="Submit">
            Spam
          </button>
        </form>
      </div>
    );
  }
}
