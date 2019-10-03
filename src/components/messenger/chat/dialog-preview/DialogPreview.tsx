import block from "bem-cn";
import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { GetChatAction, SelectChatAction } from "../../../../store/chats/actions";
import { chatSelector } from "../../../../store/chats/selectors";
import { Chat } from "../../../../store/chats/types";
import { RootState } from "../../../../store/reducer";
import "./styles.scss";
import { LastMessage } from "../last-message/LastMessage";
import { regionOptions } from "../../../../utils/helper";
import { UpdateRegionAction } from "../../../../store/region/actions";

type OwnProps = {
  chatId: number;
};

type StateProps = {
  chat: Chat;
  isGoing: boolean
};
type DispatchProps = {
  getChat: typeof GetChatAction;
  selectChat: typeof SelectChatAction;
  updateRegion: typeof UpdateRegionAction;
};


const mapStateToProps = (state: RootState, ownProps: OwnProps) => {
  return {
    chat: chatSelector(ownProps.chatId)(state),
    region: state.region.region.find((region) => {
      return region.chatId === ownProps.chatId;
    })
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  const getChatAction = { getChat: GetChatAction };
  const selectChatAction = { selectChat: SelectChatAction };
  const updateRegionAction = { updateRegion: UpdateRegionAction };
  return bindActionCreators(Object.assign({}, getChatAction, selectChatAction, updateRegionAction), dispatch);
};

@((connect as any)(mapStateToProps, mapDispatchToProps))
class ConnectedDialogPreview extends PureComponent<any, any> {
  constructor(props) {
    super(props);

  }

  componentDidMount(): void {
    const { chat, chatId } = this.props;

    if (!chat) {
      this.props.getChat(chatId);
    }
  }

  handleInputChange = (event) => {
    const { chat, chatId } = this.props;
    if (chat) {
      this.props.selectChat(chatId);
    }
  };

  handleChange = (event) => {
    const {chatId } = this.props;
    this.props.updateRegion(chatId,event.target.value);
  };

  render() {
    const bem = block("rt-dialog-preview");

    const { chat, region} = this.props;

    const { title, unread_count, last_message, type, selected } = chat || ({} as any);
    const { reigon} = region || ({} as any);
    const typeChat = type ? type["@type"] : null;
    const is_channel = type ? type.is_channel : null;
    if (typeChat !== "chatTypeSupergroup") {
      return null;
    }
    if (is_channel === true) {
      return null;
    }
    return (
      <div className={bem()}>

        <div className={bem("title")}>{title}</div>
        <div className={bem("select")}>
          <select value={reigon || "undefine"} onChange={this.handleChange}>
            {regionOptions.map((option: any) => {
              return <option value={option.value}>{option.title}</option>;
            })}
          </select>
        </div>
      </div>
    );
  }
}

export const DialogPreview = (ConnectedDialogPreview as unknown) as React.ComponentClass<OwnProps>;
