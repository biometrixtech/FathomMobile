const AlertHelper = {

    closeCancelableDropDown: () => {
        if(this._cancelableDropDown) {
            this._cancelableDropDown.close();
        }
    },

    setCancelableDropDown: dropDown => {
        this._cancelableDropDown = dropDown;
    },

    showCancelableDropDown: (type, title, message, action) => {
        if(this._cancelableDropDown) {
            this._cancelableDropDown.alertWithType(type, title, message, action);
        }
    },

    closeDropDown: () => {
        if(this._dropDown) {
            this._dropDown.close();
        }
    },

    setDropDown: dropDown => {
        this._dropDown = dropDown;
    },

    showDropDown: (type, title, message) => {
        if(this._dropDown) {
            this._dropDown.alertWithType(type, title, message);
        }
    },

}

export default AlertHelper;