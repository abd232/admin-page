import "./Menu.css";
import React from 'react';
import { Component } from "react";
import UserTable from "../userTable/UserTable.js"
import "../userTable/UserTable.css"
import UserDrugTable from "../userDrugTable/UserDrugTable"
import "../userDrugTable/UserDrugTable.css"
import AdminTable from "../AdminTable/AdminTable"
import "../AdminTable/AdminTable.css"
import DrugTable from "../drugTable/DrugTable.js"
import "../drugTable/DrugTable.css"
import DrugTable1 from "../drugTable1/DrugTable.js"
import "../drugTable/DrugTable.css"
import MoneyTable from "../moneyTable/MoneyTable.js"
import "../moneyTable/MoneyTable.css"
class Menu extends Component {
    state = { 
        menuFlag0:0,
        menuFlag1:0,
        menuFlag2:0,
        menuFlag3:0
    };
    render() { 
        return (
            <div>
                <div className="MenuContainer">
                    <ul className="menul">
                        <il className="list">
                            <button className="herff" href="#" onPointerEnter={(c) =>this.hoverd4(3)} onPointerLeave={(c) =>this.hoverdOut4(3)}>
                                السجل   
                            </button>
                            <ul className={parseInt(this.state.menuFlag3)===1 ? "menul1" : "Hide1"} >
                                    <il className="list1">
                                        <a>
                                            سجل التبرع النقدي
                                        </a>
                                    </il>
                                    <il className="list1">
                                        <a>
                                            سجل الصرف النقدي
                                        </a>
                                    </il>
                                    <il className="list1">
                                        <a>
                                            سجل التبرع بلأدوية
                                        </a>
                                    </il>
                                    <il className="list1">
                                        <a>
                                            سجل طلب الأدوية
                                        </a>
                                    </il>
                            </ul>
                        </il>
                        <li className="list">
                            <button className="herff" href="#" onPointerEnter={(c) =>this.hoverd4(2)} onPointerLeave={(c) =>this.hoverdOut4(2)}>
                                الطلبات
                            </button>
                            <ul className={parseInt(this.state.menuFlag2)===1 ? "menul1" : "Hide1"} >
                                    <il className="list1">
                                        <a>
                                            طلبات للمتبرعين 
                                        </a>
                                    </il>
                                    <il className="list1">
                                        <a>
                                            حسابات للأدوية
                                        </a>
                                    </il>
                            </ul>
                        </li>
                        <li className="list">
                            <button className="herff" href="#" onPointerEnter={(c) =>this.hoverd4(1)} onPointerLeave={(c) =>this.hoverdOut4(1)}>
                                الأدوية
                            </button>
                        </li>
                        <li className="list">
                            <button className="herff" href="#" onPointerEnter={(c) =>this.hoverd4(0)} onPointerLeave={(c) =>this.hoverdOut4(0)}>
                                الحسابات 
                            </button>
                            <ul className={parseInt(this.state.menuFlag0)===1 ? "menul1" : "Hide1"}  onPointerEnter={(c) =>this.hoverd4(0)} onPointerLeave={(c) =>this.hoverdOut4(0)}>
                                    <il className="list1">
                                        <a>
                                            حسابات المشرفين
                                        </a>
                                    </il>
                                    <il className="list1">
                                        <a>
                                            حسابات المستخدمين
                                        </a>
                                    </il>
                            </ul>
                        </li>
                    </ul>
                </div>
                <div className='Line'></div>
                <div>
                    <MoneyTable/>
                </div>
            </div>
        );
    };

    hoverd4 = (c) => {
        if (c===0)
        {
            this.setState({
            menuFlag0:1
            })
        }else if(c===1)
        {
            this.setState({
                menuFlag1:1
            })
        }else if(c===2)
        {
            this.setState({
                menuFlag2:1
            })
        }else
        {
            this.setState({
                menuFlag3:1
            })
        }
    }
    hoverdOut4 = (c) => {
        if (c===0)
        {
            this.setState({
                menuFlag0:0
            })
        }else if(c===1)
        {
            this.setState({
                menuFlag1:0
            })
        }else if(c===2)
        {
            this.setState({
                menuFlag2:0
            })
        }else
        {
            this.setState({
                menuFlag3:0
            })
        }
    }
}
export default Menu;