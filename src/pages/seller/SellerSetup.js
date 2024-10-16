import React, { useEffect, useReducer, useState } from 'react'
import { Button, message, Steps, theme, Result } from 'antd';
import BasicShopInformation from '../../components/setup/BasicShopInformation';
import TaxInformation from '../../components/setup/TaxInformation';
import { CodeSandboxCircleFilled, SmileOutlined } from '@ant-design/icons';
import logo from '../../assets/onboarding-setup.png'
import uploadFile from '../../helpers/uploadFile';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import LoadingModal from '../../components/loading/LoadingModal';
import { useNavigate } from 'react-router-dom';
import { setUpDone } from '../../redux/userSlice';


const steps = [
    {
        title: 'Thông tin shop',
        content: <BasicShopInformation />,
    },
    {
        title: 'Thông tin thuế',
        content: <TaxInformation />,
    },
    {
        title: 'Hoàn tất',
        content: <Result
            icon={<SmileOutlined />}
            title="Đã hoàn tất hồ sơ"
            extra={<Button type="primary">Tiếp theo</Button>}
        />,
    },
];

const initialState = {
    basicShopInfo: null,
    taxInfo: null,
    noErrorBasicInfo: false,
    noErrorTaxInfo: false,
    enableNextBasicInfo: false,
    enableNextTaxInfo: false,
    loading: false,
    successfully: false,
    logo_url: null
}

const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_BASIC_SHOP_INFO':
            return {
                ...state,
                basicShopInfo: action.payload
            };
        case 'SET_TAX_INFO':
            return {
                ...state,
                taxInfo: action.payload
            };
        case 'SET_NO_ERROR_BASIC_INFO':
            return {
                ...state,
                noErrorBasicInfo: action.payload
            };
        case 'SET_NO_ERROR_TAX_INFO':
            return {
                ...state,
                noErrorTaxInfo: action.payload
            };
        case 'SET_ENABLE_NEXT_BASIC_INFO':
            return {
                ...state,
                enableNextBasicInfo: action.payload
            }
        case 'SET_ENABLE_NEXT_TAX_INFO':
            return {
                ...state,
                enableNextTaxInfo: action.payload
            }
        case 'SET_LOGO_IMAGE':
            return {
                ...state,
                logo_url: action.payload
            }
        case 'SET_LOADING':
            return {
                ...state,
                loading: action.payload
            }
        case 'SET_SUCCESSFULLY':
            return {
                ...state,
                successfully: action.payload
            }
        default:
            return state;
    }
}

const SellerSetup = () => {

    const [current, setCurrent] = useState(0);
    const [state, dispatch] = useReducer(reducer, initialState);
    const dispatchUser = useDispatch();
    const user = useSelector(state => state.user);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const next = () => {
        setCurrent(current + 1);
    };
    const prev = () => {
        setCurrent(current - 1);
        dispatch({ type: 'SET_BASIC_SHOP_INFO', payload: null });
        dispatch({ type: 'SET_TAX_INFO', payload: null });
        dispatch({ type: 'SET_ENABLE_NEXT_BASIC_INFO', payload: false });
        dispatch({ type: 'SET_ENABLE_NEXT_TAX_INFO', payload: false });

    };
    const handleBasicShopInfoChange = (data) => {
        dispatch({ type: 'SET_BASIC_SHOP_INFO', payload: data });
    };

    const handleTaxInfoChange = (data) => {
        dispatch({ type: 'SET_TAX_INFO', payload: data });
    };

    const items = steps.map((item) => ({
        key: item.title,
        title: item.title,
    }));

    const handleStart = () => {
        setStepOn(true);
    }

    const [stepOn, setStepOn] = useState(false);

    const handleChangeSetupStatus = async () => {
        const user_id = user.user_id;
        try {
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/update-setup-status`, {
                user_id: user_id
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            console.log("Successfully change setup status:");
            dispatchUser(setUpDone());
        } catch (error) {
            console.log("Change setup status error:", error.message);
            console.log("Error response data:", error.response ? error.response.data : "No response data");
        }
    }
    const handleSaveSeller = async () => {
        dispatch({ type: 'SET_LOADING', payload: true });
        const img = state.basicShopInfo ? state.basicShopInfo.imageUrl : null;
        const upload = await uploadFile(img[0].originFileObj, 'seller-img');
        const basicShopInfo = state.basicShopInfo;
        const taxInfo = state.taxInfo;
        const payload = {
            shop_name: basicShopInfo.shop_name,
            logo_url: upload.url,
            shop_description: basicShopInfo.shop_description,
            business_style_id: taxInfo.business_style_id,
            tax_code: taxInfo.tax_code,
            business_email: taxInfo.business_email,
            province_id: basicShopInfo.province_id,
            district_id: basicShopInfo.district_id,
            ward_code: basicShopInfo.ward_code,
            shop_address: basicShopInfo.shop_address,
            full_name: basicShopInfo.full_name,
            citizen_number: basicShopInfo.citizen_number,
            user_id: user.user_id
        };

        console.log("Payload being sent to server:", payload);

        try {
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/create-shop`, payload);
            console.log('Shop created successfully:', res.data);
            dispatch({ type: 'SET_SUCCESSFULLY', payload: true });
            return res.data;
        } catch (error) {
            console.log("Create shop error:", error.message);
            console.log("Error response data:", error.response ? error.response.data : "No response data");
            return error.message;
        }
    };

    useEffect(() => {
        // reset state when stepOn is false
        dispatch({ type: 'SET_ENABLE_NEXT_BASIC_INFO', payload: false });
        dispatch({ type: 'SET_ENABLE_NEXT_TAX_INFO', payload: false });

        const noErrorBasicInfo = state.basicShopInfo ? state.basicShopInfo.noErrorBasicInfo : null;
        const noErrorTaxInfo = state.taxInfo ? state.taxInfo.noErrorTaxInfo : null;
        if (noErrorBasicInfo) {
            dispatch({ type: 'SET_ENABLE_NEXT_BASIC_INFO', payload: true });
            console.log("Basic Info: ", state.basicShopInfo);
        }
        else
            console.log("Basic Info: ", state.basicShopInfo);

        if (noErrorTaxInfo) {
            dispatch({ type: 'SET_ENABLE_NEXT_TAX_INFO', payload: true });
            console.log("Tax info Truc oiiiiiiiiiiiiiii: ", state.taxInfo);
        } else
            console.log("Tax info Truc oiiiiiiiiiiiiiii: ", state.taxInfo);
    }, [state.basicShopInfo, state.taxInfo])

    useEffect(() => {
        const updateSetupStatus = async () => {
            if (state.successfully) {
                await handleChangeSetupStatus();
                dispatch({ type: 'SET_SUCCESSFULLY', payload: false });
                dispatch({ type: 'SET_LOADING', payload: false });
                message.success('Đăng kí cửa hàng thành công');
                navigate('/seller');
            }
        };
        updateSetupStatus();
    }, [state.successfully])

    useEffect(() => {
        if (user.setup === 1) {
            navigate('/seller');
        }
    }, [user])

    return (
        <div>
            {!stepOn && (
                <div className='mx-auto w-[80%] h-[500px] bg-white pt-[35px] flex flex-col gap-3'>
                    <img
                        src={logo}
                        alt='logo'
                        className='w-[200px] h-[200px] mx-auto' />
                    <div className='flex items-center'>
                        <h5 className='text-lg mx-auto'>Chào mừng đến với Ezy!</h5>
                    </div>
                    <div className='flex items-center'>
                        <p className='text-sm mx-auto'>Vui lòng cung cấp thông tin để thành lập tài khoản người bán trên Ezy</p>
                    </div>
                    <div className='flex items-center'>
                        <Button
                            onClick={handleStart}
                            className='text-lg mx-auto bg-primary text-white'
                        >Bắt đầu đăng ký</Button>
                    </div>
                </div>
            )}
            {stepOn && (
                <div className='w-[80%] mx-auto'>
                    <Steps current={current} items={items} />
                    <div className='mt-8 w-full bg-white p-5 border rounded-lg'>
                        {current === 0 && <BasicShopInformation onData={handleBasicShopInfoChange} />}
                        {current === 1 && <TaxInformation onData={handleTaxInfoChange} />}
                        {current === 2 && (
                            <Result
                                icon={<SmileOutlined />}
                                title="Chọn tiếp theo để hoàn tất hồ sơ"
                                extra={
                                    <Button
                                        onClick={handleSaveSeller}
                                        type="primary"
                                    >Tiếp theo
                                    </Button>}
                            />
                        )}
                    </div>
                    <div className='mt-5 mb-10'>
                        {
                            current === 0 && (
                                <Button
                                    disabled={!state.enableNextBasicInfo}
                                    type="primary"
                                    onClick={() => next()}>
                                    Tiếp
                                </Button>
                            )
                        }
                        {
                            current === 1 && (
                                <Button
                                    disabled={!state.enableNextTaxInfo}
                                    type="primary"
                                    onClick={() => next()}>
                                    Tiếp
                                </Button>
                            )
                        }
                        {current > 0 && (
                            <Button
                                style={{ margin: '0 8px' }}
                                onClick={() => prev()}
                            >
                                Quay lại
                            </Button>
                        )}
                    </div>
                </div>
            )}
            <LoadingModal visible={state.loading} />

        </div>

    )
}

export default SellerSetup