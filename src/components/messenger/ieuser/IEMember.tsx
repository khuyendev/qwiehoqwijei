import { PureComponent } from "react";
import * as React from "react";
import { RootState } from "../../../store/reducer";
import { connect } from "react-redux";
import { asyncSendMessage } from "../../../store/telegram/saga";
import _ from "lodash";
import { DialogPreview } from "../chat/dialog-preview/DialogPreview";

const mapStateToProps = (state: RootState) => {
  return {
    chats: state.chats
  };
};

@((connect as any)(mapStateToProps))
class IEMemberComponent extends PureComponent<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      members: []
    };
  }

  onFileChange = (event) => {
    var reader = new FileReader();

    reader.onload = (event:any) =>{
      let members = [];
      const jsonObj = JSON.parse(event.target.result);
      console.log(jsonObj);
      members = _.concat(members, jsonObj);
      const filter = members.filter(function(elem, index, self) {
        return index === self.indexOf(elem);
      });
      this.setState({
        members: filter
      });
    }

    reader.readAsText(event.target.files[0]);

  };


  addMemberFromSelectedGroup = async () => {
    const { chats } = this.props.chats;
    let members = [];
    await Promise.all([chats.forEach(async (chat) => {
      if (chat.selected) {
        const member: any = await this.getAllMemberFromGroup(chat);
        members = _.concat(members, member);
        const filter = members.filter(function(elem, index, self) {
          return index === self.indexOf(elem);
        });
        console.log(members);
        this.setState({
          members: _.concat(this.state.members, filter)
        });
      }
    })]);
  };

  getAllMemberFromGroup = async (chat) => {
    return new Promise(async (resolve, reject) => {
      let totalMember = 1;
      let receivedMember = 0;
      const limit = 200;
      let members = [];
      while (receivedMember < totalMember) {
        try {
          const { payload } = await asyncSendMessage({
            "@type": "getSupergroupMembers",
            supergroup_id: chat.type.supergroup_id,
            limit: limit,
            offset: receivedMember
          });
          const { data } = payload;
          totalMember = data.total_count;
          receivedMember = receivedMember + limit;
          members = _.concat(members, data.members);
        } catch (e) {
          reject(e);
        }
      }
      resolve(members);
    });
  };

  write = async () => {
    const fileData = JSON.stringify(this.state.members);
    const blob = new Blob([fileData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "member.json";
    link.href = url;
    link.click();
  };

  render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    return (
      <div>
        <div style={{ display: "grid", width: 600 }}>
          <button onClick={this.addMemberFromSelectedGroup}>
            Add member from selected group
          </button>
          <div style={{
            flexDirection: "column",
            width: 600,
            padding: 8,
            borderColor: "black",
            borderWidth: 1,
            border: 1
          }}>
            <text style={{ width: 100 }} onClick={this.addMemberFromSelectedGroup}>
              Add member from local file
            </text>
            <input type="file" onChange={this.onFileChange}/>
          </div>
          <div style={{
            flexDirection: "column",
            width: 600,
            padding: 8,
            borderColor: "black",
            borderWidth: 1,
            border: 1
          }}>
            <button onClick={this.write}>
              Save member to local
            </button>
          </div>
        </div>
        <div style={{ height: 700, width: 600, overflow: "hidden", overflowY: "auto" }}>
          {this.state.members.map((user) => {
            return (
              <div style={{ display: "gird" }}>
                <text>{user.user_id}</text>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}


export const IEMember = (IEMemberComponent as unknown) as React.ComponentClass<any>;
