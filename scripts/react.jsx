class FormInput extends React.Component {
  constructor() {
    super();
    this.id = makeid();
    this.type = "text";
  }
  render() {
    var label = this.props.children;
    var onChange = this.props.onChange;
    return (
      <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
        <input className="mdl-textfield__input" type={this.type} id={this.id} onChange={onChange} />
        <label className="mdl-textfield__label" htmlFor={this.id}>{label}</label>
      </div>
    );
  }
}

class NumberFormInput extends FormInput {
  constructor() {
    super();
    this.type = "number";
  }
}

class CheckBoxFormInput extends FormInput {
  constructor() {
    super();
    this.type = "checkbox";
  }
  render() {
    var label = this.props.children;
    var onChange = this.props.onChange;
    return (
      <label className="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" htmlFor={this.id}>
        <input type="checkbox" id={this.id} className="mdl-checkbox__input" onChange={onChange}/>
        <span className="mdl-checkbox__label">{label}</span>
      </label>
    );
  }
}

class FileFormInput extends FormInput {
  constructor() {
    super();
    this.type = "file";
  }
  render() {
    var label = this.props.children;
    var onChange = this.props.onChange;
    return (
      <p> 
        {label} &nbsp;&nbsp;&nbsp;
        <input type={this.type} id={this.id} onChange={onChange} className="mdl-checkbox__input" />
      </p>
    );
  }
}

class FloatingActionButton extends React.Component {
  constructor() {
    super();
    this.action = function() {
      window.location.href = "/";
    };
    this.icon = "add";
    this.alt_text = "Add";
  }
  render() {
    return (
      <button onClick={this.action} className="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored mdl-shadow--4dp mdl-color--accent" id="add">
        <i className="material-icons" role="presentation">{this.icon}</i>
        <span className="visuallyhidden">{this.alt_text}</span>
      </button>
    );
  }
}

class UnLockFAB extends FloatingActionButton {
  constructor() {
    super();
    this.action = function() {
      login();
    }
    this.icon = "lock_open";
    this.alt_text = "Lock Open"
  }
}

class LockFAB extends FloatingActionButton {
  constructor() {
    super();
    this.action = function() {
      logout();
    }
    this.icon = "lock";
    this.alt_text = "Lock"
  }
}

class Card extends React.Component {
  constructor() {
    super();
    this.actionButtons = {};
    this.getActionsHTML = this.getActionsHTML.bind(this);
    this.getBodyHTML = this.getBodyHTML.bind(this);
    this.id = makeid();
  }
  getBodyHTML(defaultBody) {
    return (
      { defaultBody }
    )
  }
  getActionsHTML() {
    var actionButtons = this.actionButtons;
    var id = "progressBar-" + this.id;
    var that_id = this.id;
    return (
      <div className="mdl-card__actions">
        <div id={id} className="mdl-progress mdl-js-progress mdl-progress__indeterminate"></div>
        {
          Object.keys(actionButtons).map(function(buttonName) {
            var func = actionButtons[buttonName];
            func = wrapProgressBarOnFunction(that_id, func);
            return <a key={buttonName} className="mdl-button" onClick={func}>{buttonName}</a>;
          })
        }
      </div>
    );
  }
  render() {
    var title = this.props.title;
    var body = this.props.children;
    return (
        <section className="section--center mdl-grid mdl-grid--no-spacing mdl-shadow--2dp">
          <div className="mdl-card mdl-cell mdl-cell--12-col">
            <div className="mdl-card__supporting-text">
              <h4>{title}</h4>
              {this.getBodyHTML(body)}
            </div>
            {this.getActionsHTML()}
          </div>
        </section>
    );
  }
}

class AuthenticateNoticeCard extends Card {
  constructor() {
    super();
  }
  getBodyHTML(defaultBody) {
    return (
      <p>You must first login as MDB Application Portal admin...</p>
    );
  }
}

class FormCard extends Card {
  constructor() {
    super();
    var that = this;
    this.actionButtons = {
      Submit: function() {
        submitApplication(that.state);
      }
    };
    this.state = {};
    this.bindInput = this.bindInput.bind(this);
  }
  bindInput(key, type) {
    var that = this;
    return function(e) {
      var stateUpdate = {};
      if (type == "string") stateUpdate[key] = e.target.value;
      else if (type == "number") stateUpdate[key] = parseInt(e.target.value);
      else if(type == "boolean") stateUpdate[key] = e.target.checked;
      else if (type == "file") stateUpdate[key] = e.target.files[0];
      that.setState(stateUpdate);
    }
  }
  getBodyHTML(defaultBody) {
    return (
      <form>
        <p>Please fill out the application to the best of your ability.</p>
        <FormInput onChange={this.bindInput("name", "string")}>Full name</FormInput>
        <br />
        <NumberFormInput onChange={this.bindInput("age", "number")}>Age</NumberFormInput>
        <br />
        <CheckBoxFormInput onChange={this.bindInput("wanaBeInMDB", "boolean")}>Do you want to be in MDB?</CheckBoxFormInput>
        <br />
        <FileFormInput onChange={this.bindInput("resume", "file")}>Resume plz</FileFormInput>
        <br />
      </form>
    );
  } 
}

class ListSubmitedAppsCard extends Card {
  constructor() {
    super();
  }
  getBodyHTML(defaultBody) {
    return (
      <table className="mdl-data-table mdl-js-data-table">
        <thead>
          <tr>
            <th className="mdl-data-table__cell--non-numeric">Name</th>
            <th>Age</th>
            <th>Wants to Be in MDB</th>
            <th>Resume Uploaded</th>
          </tr>
        </thead>
        <tbody>
          {
            applications.map(function(application, index) {
              var wanaBeInMDB = application.wanaBeInMDB ? "true" : "false";
              var resume = application.resume != null ? "true" : "false";
              return (
                <tr key = {index}>
                  <td className="mdl-data-table__cell--non-numeric">{application.name}</td>
                  <td>{application.age}</td>
                  <td>{wanaBeInMDB}</td>
                  <td>{resume}</td>
                </tr>
              );
            })
          }
        </tbody>
      </table>
    );
  }
}

ReactDOM.render(
  <FormCard title="New Member Application" />,
  document.getElementById('form')
);

var applications = [];

isAuthenicated().then(function(isAuthed) {
  if (isAuthed) {
    getSubmitedApplications().then(function(applicationss) {
      applications = applicationss;
      ReactDOM.render(
        <ListSubmitedAppsCard title="Submited Applications" />,
        document.getElementById('submited')
      );
    });
    ReactDOM.render(
      <LockFAB />,
      document.getElementById("fab-container")
    );
  } else {
    ReactDOM.render(
      <AuthenticateNoticeCard title="Please Authenticate" />,
      document.getElementById('submited')
    );
    ReactDOM.render(
      <UnLockFAB />,
      document.getElementById("fab-container")
    );
  }
});
