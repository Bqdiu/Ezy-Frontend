import { Button, Col, Input, message, Modal, Popconfirm, Row, Upload } from 'antd'
import React, { forwardRef, useEffect, useImperativeHandle, useReducer, useRef } from 'react'
import { GoPlus } from "react-icons/go";
import { RiImageAddFill } from 'react-icons/ri';
import { CiSquarePlus, CiSquareRemove } from "react-icons/ci";
import { addProductClassify, addProductSize, addProductVarient, deleteProductVarient, getProductSize, resetProductStock } from '../../../services/productService';
import uploadFile from '../../../helpers/uploadFile';
const initialState = {
  visible_btn_add_classify: true,
  visible_btn_add_varient: true,
  classify_rows: [],
  classify_type: null,
  classifies_image: [],
  classifies_name: [],
  varient_type: null,
  varient_rows: [],
  varient_name: [],
  errors: {
    classify_type: 'Chưa nhập tên phân loại',
    varient_type: 'Chưa nhập tên phân loại'
  },
  touchs: {
    classify_type: false,
    varient_type: false
  },
  enable_submit: false,
  submit_loading: false
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_VISIBLE_BTN_ADD_CLASSIFY':
      return { ...state, visible_btn_add_classify: action.payload }
    case 'SET_VISIBLE_ADD_VARIENT':
      return { ...state, visible_btn_add_varient: action.payload }
    case 'SET_CLASSIFY_ROWS':
      return { ...state, classify_rows: action.payload }
    case 'SET_CLASSIFY_TYPE':
      return { ...state, classify_type: action.payload }
    case 'SET_CLASSIFIES_IMAGE':
      return { ...state, classifies_image: action.payload }
    case 'SET_CLASSIFIES_NAME':
      return { ...state, classifies_name: action.payload }
    case 'SET_VARIENT_ROWS':
      return { ...state, varient_rows: action.payload }
    case 'SET_VARIENT_TYPE':
      return { ...state, varient_type: action.payload }
    case 'SET_VARIENTS_NAME':
      return { ...state, varient_name: action.payload }
    case 'SET_ERROR':
      return { ...state, errors: { ...state.errors, [action.payload.name]: action.payload.value } }
    case 'SET_TOUCH':
      return { ...state, touchs: { ...state.touchs, [action.payload.name]: action.payload.value } }
    case 'SET_ENABLE_SUBMIT':
      return { ...state, enable_submit: action.payload }
    case 'SET_SUBMIT_LOADING':
      return { ...state, submit_loading: action.payload }
    case 'RESET':
      return initialState
    default:
      return state
  }
}

const EditProductLevel1Modal = forwardRef(({ visible, onCancel, product, resetDataSource }, ref) => {

  const [state, dispatch] = useReducer(reducer, initialState);
  const prevClassifyRowsRef = useRef([]);
  const prevVarientRowsRef = useRef([]);
  const uploadButton = (
    <button
      style={{
        border: 0,
        background: 'none',
      }}
      type="button"
      className='mt-2'
    >
      {<RiImageAddFill size={30} />}
    </button>
  );

  const resetState = () => {
    dispatch({ type: 'RESET' })
  }

  useImperativeHandle(ref, () => ({
    resetState,
  }));

  const beforeUpload = file => {
    const isImage = file.type.startsWith('image/');
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isImage) {
      message.error('Bạn chỉ có thể tải lên tệp hình ảnh!');
      return Upload.LIST_IGNORE;
    }
    if (!isLt2M) {
      message.error('Kích thước tập tin vượt quá 2.0 MB');
      return Upload.LIST_IGNORE;
    }
    return true;
  };



  const handleClassifyTypeChange = (value) => {
    dispatch({ type: 'SET_TOUCH', payload: { name: 'classify_type', value: true } })
    dispatch({ type: 'SET_CLASSIFY_TYPE', payload: value })
    if (value === '') {
      dispatch({ type: 'SET_ERROR', payload: { name: 'classify_type', value: 'Hãy nhập tên phân loại' } })
    }
    else {
      dispatch({ type: 'SET_ERROR', payload: { name: 'classify_type', value: '' } })
    }
    validateSubmit();
  }
  // classify
  const handleAddProductClassify = () => {
    dispatch({ type: 'SET_VISIBLE_BTN_ADD_CLASSIFY', payload: false })
  }
  const handleAddClassifyRow = () => {
    const newClassifyRow = {
      key: state.classify_rows.length + 1,
      classify_image: [],
      classify_name: '',
      error_classify_name: '',
      error_classify_image: 'Hãy chọn ảnh của phân loại',
      touch: false
    };
    dispatch({ type: 'SET_CLASSIFY_ROWS', payload: [...state.classify_rows, newClassifyRow] });
  };

  const handleRemoveClassifyRow = (key) => {
    const newClassifyRows = state.classify_rows.filter(row => row.key !== key)
    dispatch({ type: 'SET_CLASSIFY_ROWS', payload: newClassifyRows })
  }

  const handleInputClassifyNameChange = (key, value) => {
    const isDuplicate = value !== '' && state.classify_rows.some(row => row.classify_name === value && row.key !== key);
    const updatedRows = state.classify_rows.map(row =>
      row.key === key
        ? {
          ...row,
          classify_name: value,
          error_classify_name: value === '' ? 'Hãy nhập phân loại' : isDuplicate ? 'Phân loại không được trùng' : '',
          touch: true,
        }
        : row
    );
    dispatch({ type: 'SET_CLASSIFY_ROWS', payload: updatedRows });
  };
  const handleUploadClassifyImageChange = (key, { fileList }) => {
    const updatedRows = state.classify_rows.map(row =>
      row.key === key ? {
        ...row,
        classify_image: fileList,
        error_classify_image: fileList.length === 0 ? 'Hãy chọn ảnh của phân loại' : '',
        touch: true,
      } : row
    );
    dispatch({ type: 'SET_CLASSIFY_ROWS', payload: updatedRows });
  };

  const handleRemoveClassifyImage = (key) => {
    const newClassifyImage = state.classifies_image.filter((image, index) => index !== key)
    dispatch({ type: 'SET_CLASSIFIES_IMAGE', payload: newClassifyImage })
  }

  // varient

  const handleAddVarient = () => {
    dispatch({ type: 'SET_VISIBLE_ADD_VARIENT', payload: !state.visible_btn_add_varient })
    if (!state.visible_btn_add_varient) {
      // reset state
      dispatch({ type: 'SET_VARIENT_TYPE', payload: null })
      dispatch({ type: 'SET_TOUCH', payload: { name: 'varient_type', value: false } })
      dispatch({ type: 'SET_ERROR', payload: { name: 'varient_type', value: 'Hãy nhập tên phân loại' } })
      dispatch({ type: 'SET_VARIENT_ROWS', payload: [] });
    }
  }

  const handleVarientTypeChange = (value) => {
    dispatch({ type: 'SET_TOUCH', payload: { name: 'varient_type', value: true } })
    dispatch({ type: 'SET_VARIENT_TYPE', payload: value })
    if (value === '') {
      dispatch({ type: 'SET_ERROR', payload: { name: 'varient_type', value: 'Hãy nhập tên phân loại' } })
    }
    else {
      dispatch({ type: 'SET_ERROR', payload: { name: 'varient_type', value: '' } })
    }
  }

  const handleAddVarientRow = () => {
    const newVarientRow = {
      key: state.varient_rows.length + 1,
      varient_name: '',
      error_varient_name: '',
      touch: false
    };
    dispatch({ type: 'SET_VARIENT_ROWS', payload: [...state.varient_rows, newVarientRow] });
  };

  const handleRemoveVarientRow = (key) => {
    const newVarientRows = state.varient_rows.filter(row => row.key !== key)
    dispatch({ type: 'SET_VARIENT_ROWS', payload: newVarientRows })
  }

  const handleInputVarientNameChange = (key, value) => {
    const isDuplicate = value !== '' && state.varient_rows.some(row => row.varient_name === value && row.key !== key);
    const updatedRows = state.varient_rows.map(row =>
      row.key === key
        ? {
          ...row,
          varient_name: value,
          error_varient_name: value === '' ? 'Hãy nhập phân loại' : isDuplicate ? 'Phân loại không được trùng' : '',
          touch: true,
        }
        : row
    );
    dispatch({ type: 'SET_VARIENT_ROWS', payload: updatedRows });
    validateSubmit();
  };

  const validateSubmit = () => {
    // Validate classify fields
    const classifyTypeValid = state.classify_type !== '';
    let enableSubmit = false;
    let classifyRowsValid = state.classify_rows.every(row =>
      row.classify_name !== '' &&
      row.classify_image.length > 0 &&
      row.error_classify_name === '' &&
      row.error_classify_image === ''
    );

    if (state.classify_rows.length === 0) {
      classifyRowsValid = false;
    }

    let varientTypeValid = false;
    let varientRowsValid = false;
    if (!state.visible_btn_add_varient) {
      varientTypeValid = state.varient_type !== '';
      varientRowsValid = state.varient_rows.every(row =>
        row.varient_name !== '' &&
        row.error_varient_name === ''
      );
      if (state.varient_rows.length === 0) {
        varientRowsValid = false
      }
    }
    else {
      varientTypeValid = true;
      varientRowsValid = true;
    }

    if (classifyTypeValid && classifyRowsValid && varientTypeValid && varientRowsValid) {
      enableSubmit = true;
    }
    dispatch({ type: 'SET_ENABLE_SUBMIT', payload: enableSubmit });
  };


  const handleUploadClassifyThumnail = async (thumnails) => {
    console.log("Classify Thumnail: ", thumnails);
    const uploadPromises = thumnails.map(file => uploadFile(file.originFileObj, 'seller-img'));
    try {
      const uploadResults = await Promise.all(uploadPromises);
      console.log("Upload Classify Thumnail: ", uploadResults);
      const uploadUrls = uploadResults.map(file => file.url);
      return uploadUrls;
    } catch (error) {
      console.log("Error uploading classify thumbnail:", error);
      return [];
    }
  }

  const handleUpdateProductLevel2 = async (classify_rows) => {
    try {
      const classifyDataArray = await Promise.all(classify_rows.map(async (row) => {
        const classifyThumnails = await handleUploadClassifyThumnail(row.classify_image);
        const classifyData = {
          product_id: product.product_id,
          product_classify_name: row.classify_name,
          type_name: state.classify_type,
          thumbnail: classifyThumnails[0]
        }
        return classifyData;
      }));
      console.log("Classify Data Array: ", classifyDataArray);
      const classifyResults = await Promise.all(classifyDataArray.map(async (classifyData) => {
        try {
          const res = await addProductClassify(classifyData);
          return res;
        } catch (error) {
          console.error('Error adding product classify:', error);
          throw error;
        }
      }));
      console.log("Classify Results: ", classifyResults);
      const varientsResults = await Promise.all(classifyResults.map(async (classifyResult) => {
        const varientData = {
          product_id: product.product_id,
          product_classify_id: classifyResult.data.product_classify_id,
          product_size_id: null,
          price: 0,
          stock: 0,
          sale_percents: 0,
          height: 0,
          length: 0,
          width: 0,
          weight: 0
        }
        try {
          const res = await addProductVarient(varientData);
          return res;
        }
        catch (error) {
          console.error('Error adding product varient:', error);
          throw error
        }
      }));
      console.log("Varient Results: ", varientsResults);
    } catch (error) {
      console.log('Error in handleUpdateProductLevel2:', error);
    }
  }

  const handleAddSizes = async (varient_rows) => {
    try {
      const sizePromises = varient_rows.map(async (row) => {
        try {
          const sizePayload = {
            product_id: product.product_id,
            product_size_name: row.varient_name,
            type_of_size: state.varient_type,
          };
          const res = await addProductSize(sizePayload);
          return res;
        } catch (error) {
          console.error('Error adding product size:', error);
          throw error;
        }
      });

      const sizeResults = await Promise.all(sizePromises);
      console.log("Size Results: ", sizeResults);
      return sizeResults;
    } catch (error) {
      console.error('Error in handleAddSizes:', error);
      return [];
    }
  };
  const handleUpdateProductLevel3 = async (classify_rows, varient_rows) => {
    try {
      const classifyDataArray = await Promise.all(classify_rows.map(async (row) => {
        const classifyThumnails = await handleUploadClassifyThumnail(row.classify_image);
        const classifyData = {
          product_id: product.product_id,
          product_classify_name: row.classify_name,
          type_name: state.classify_type,
          thumbnail: classifyThumnails[0]
        }
        return classifyData;
      }));
      console.log("Classify Data Array: ", classifyDataArray);
      const classifyResults = await Promise.all(classifyDataArray.map(async (classifyData) => {
        try {
          const res = await addProductClassify(classifyData);
          return res;
        } catch (error) {
          console.error('Error adding product classify:', error);
          throw error;
        }
      }));
      console.log("Classify Results: ", classifyResults);
      const sizes = await handleAddSizes(varient_rows);
      if (sizes.length === 0) {
        message.error('Lỗi khi thêm phân loại sản phẩm');
      }
      else {
        const sizeRes = await getProductSize({ product_id: product.product_id });
        const varientsResults = [];
        for (const classifyResult of classifyResults) {
          const varientResults = [];
          for (const size of sizeRes.data) {
            const varientData = {
              product_id: product.product_id,
              product_classify_id: classifyResult.data.product_classify_id,
              product_size_id: size.product_size_id,
              price: 0,
              stock: 0,
              sale_percents: 0,
              height: 0,
              length: 0,
              width: 0,
              weight: 0
            };
            try {
              const res = await addProductVarient(varientData);
              varientResults.push(res);
            } catch (error) {
              console.error('Error adding product varient:', error);
              throw error;
            }
          }
          varientsResults.push(varientResults);
        }
        console.log("Varient Results: ", varientsResults);
      }
    } catch (error) {
      console.log('Error in handleUpdateProductLevel2:', error);
    }
  }

  const handleSubmit = async () => {
    dispatch({ type: 'SET_SUBMIT_LOADING', payload: true });
    try {
      if (state.varient_rows.length === 0) {
        try {
          const delete_old_varient = await deleteProductVarient(product.ProductVarients[0].product_varients_id);
          console.log('Delete old varient:', delete_old_varient);
          if (delete_old_varient?.status === 400) {
            message.error('Sản phẩm này đang được sử dụng không thể cập nhật phân loại');
          }
          else {
            await resetProductStock(product.product_id);
            await handleUpdateProductLevel2(state.classify_rows);
            resetDataSource();
            message.success('Chỉnh sửa phân loại thành công');
          }

        } catch (error) {
          console.log('Error in delete old varient:', error);
        }
      }
      else {
        try {
          const delete_old_varient = await deleteProductVarient(product.ProductVarients[0].product_varients_id);
          console.log('Delete old varient:', delete_old_varient);
          if (delete_old_varient?.status === 400) {
            message.error('Sản phẩm này đang được sử dụng không thể cập nhật phân loại');
          }
          else {
            await resetProductStock(product.product_id);
            await handleUpdateProductLevel3(state.classify_rows, state.varient_rows);
            resetDataSource();
            message.success('Chỉnh sửa phân loại thành công');
          }
        } catch (error) {
          console.log('Error in delete old varient:', error);
        }
      }
    } catch (error) {
      message.error('Có lỗi xảy ra, vui lòng thử lại sau');
      console.log('Error in handleSubmit:', error);
    } finally {
      dispatch({ type: 'SET_SUBMIT_LOADING', payload: false });
      onCancel();
    }
  }


  useEffect(() => {
    const hasClassifyRowsChanged = state.classify_rows.some((row, index) => {
      const prevRow = prevClassifyRowsRef.current[index] || {};
      return (
        row.classify_name !== prevRow.classify_name ||
        row.classify_image.length !== prevRow.classify_image?.length ||
        row.error_classify_name !== prevRow.error_classify_name ||
        row.error_classify_image !== prevRow.error_classify_image
      );
    });

    const hasVarientRowsChanged = state.varient_rows.some((row, index) => {
      const prevRow = prevVarientRowsRef.current[index] || {};
      return (
        row.varient_name !== prevRow.varient_name ||
        row.error_varient_name !== prevRow.error_varient_name
      );
    });

    if (
      hasClassifyRowsChanged ||
      hasVarientRowsChanged ||
      state.classify_type !== prevClassifyRowsRef.current.classify_type ||
      state.varient_type !== prevVarientRowsRef.current.varient_type
    ) {
      validateSubmit();
      prevClassifyRowsRef.current = [...state.classify_rows];
      prevVarientRowsRef.current = [...state.varient_rows];
    }
  }, [
    state.classify_rows,
    state.classify_type,
    state.varient_rows,
    state.varient_type,
    state.visible_btn_add_varient
  ]);




  useEffect(() => {
    // console.log('classify_rows:', state.classify_rows);
    // console.log('varient_rows:', state.varient_rows);
  }, [
    state.classify_rows,
    state.classify_type,
    state.varient_type,
    state.varient_rows,
    state.visible_btn_add_varient

  ])

  useEffect(() => {
    if (product && product?.ProductVarients[0]?.ProductClassify == null) {
      // console.log('Nhan level 1 duoc roi nha cam on:', product);
    }
  }, [product])
  return (
    <div>
      <Modal
        open={visible}
        title="Chỉnh sửa phân loại"
        onCancel={onCancel}
        centered={true}
        footer={[
          <Button
            key="cancel"
            onClick={onCancel}
            loading={state.submit_loading}
          >
            Hủy
          </Button>,
          <Popconfirm
            description="Xác nhận"
            onConfirm={handleSubmit}
            // onOpenChange={() => console.log('open change')}
          >
            <Button
              disabled={!state.enable_submit}
              loading={state.submit_loading}
              type="primary">
              Lưu thay đổi
            </Button>
          </Popconfirm>
        ]}
      >
        <div>
          {
            state.visible_btn_add_classify ? (
              <div>
                <p>Chưa có phân loại</p>
                <Button
                  type="dashed"
                  icon={<GoPlus size={25} />}
                  className='text-sm'
                  onClick={handleAddProductClassify}
                >
                  Thêm nhóm phân loại
                </Button>
              </div>
            ) : (
              <div>
                <Row className='flex items-center mb-5 mt-5'>
                  <Col span={4}>
                    <div className='font-semibold'>Phân loại 1</div>
                  </Col>
                  <Col span={20}>
                    <Input
                      showCount
                      maxLength={15}
                      placeholder="ví dụ: màu sắc v.v"
                      value={state.classify_type}
                      onChange={(e) => handleClassifyTypeChange(e.target.value)}
                    />
                    {state.errors.classify_type && state.touchs.classify_type && (<div className='text-red-500 text-sm'>{state.errors.classify_type}</div>)}
                  </Col>
                </Row>
                {state.classify_rows.map((row) => (
                  <Row key={row.key} className='flex items-center mb-2' gutter={10}>
                    <Col span={6}>
                      <Upload
                        listType="picture-card"
                        className="avatar-uploader"
                        showUploadList={true}
                        fileList={row.classify_image}
                        maxCount={1}
                        beforeUpload={beforeUpload}
                        onChange={({ fileList }) => handleUploadClassifyImageChange(row.key, { fileList })}
                        onRemove={() => handleRemoveClassifyImage(row.key)}
                      >
                        {row.classify_image.length < 1 && (
                          uploadButton
                        )}
                      </Upload>
                    </Col>
                    <Col span={16}>
                      <Input
                        value={row.classify_name}
                        showCount
                        maxLength={20}
                        placeholder="Nhập phân loại"
                        onChange={(e) => handleInputClassifyNameChange(row.key, e.target.value)}
                      />
                      {row.error_classify_name && row.touch && (<div className='text-red-500 text-sm'>{row.error_classify_name}</div>)}
                      {row.error_classify_image && row.touch && (<div className='text-red-500 text-sm'>{row.error_classify_image}</div>)}
                    </Col>
                    <Col span={2}>
                      <CiSquareRemove
                        size={25}
                        className='cursor-pointer'
                        onClick={() => handleRemoveClassifyRow(row.key)}
                        color='#ff4d4f' />
                    </Col>
                  </Row>
                ))}
                <CiSquarePlus
                  size={30}
                  onClick={handleAddClassifyRow}
                  className='mx-auto cursor-pointer'
                  color='#327bb3'
                />
                {state.visible_btn_add_varient ? (
                  <div>
                    <p className='font-semibold'>Phân loại 2</p>
                    <Button
                      type="dashed"
                      icon={<GoPlus size={25} />}
                      className='text-sm'
                      onClick={handleAddVarient}
                    >
                      Thêm nhóm phân loại 2
                    </Button>
                  </div>
                ) : (
                  <div>
                    <Row className='flex items-center mb-5 mt-5' gutter={10}>
                      <Col span={4}>
                        <div className='font-semibold'>Phân loại 2</div>
                      </Col>
                      <Col span={18}>
                        <Input
                          showCount
                          maxLength={15}
                          placeholder="ví dụ: kích thước v.v"
                          value={state.varient_type}
                          onChange={(e) => handleVarientTypeChange(e.target.value)}
                        />
                        {state.errors.varient_type && state.touchs.varient_type && (<div className='text-red-500 text-sm'>{state.errors.varient_type}</div>)}
                      </Col>
                      <Col span={2}>
                        <CiSquareRemove
                          size={25}
                          className='cursor-pointer'
                          onClick={handleAddVarient}
                          color='#ff4d4f' />
                      </Col>
                    </Row>
                    {state.varient_rows.map((row) => (
                      <Row key={row.key} className='flex items-center mb-2' gutter={10}>
                        <Col span={22}>
                          <Input
                            value={row.varient_name}
                            showCount
                            maxLength={20}
                            placeholder="Nhập phân loại"
                            onChange={(e) => handleInputVarientNameChange(row.key, e.target.value)}
                          />
                          {row.error_varient_name && row.touch && (<div className='text-red-500 text-sm'>{row.error_varient_name}</div>)}
                        </Col>
                        <Col span={2}>
                          <CiSquareRemove
                            size={25}
                            className='cursor-pointer'
                            onClick={() => handleRemoveVarientRow(row.key)}
                            color='#ff4d4f' />
                        </Col>
                      </Row>
                    ))}
                    <CiSquarePlus
                      size={30}
                      onClick={handleAddVarientRow}
                      className='mx-auto cursor-pointer'
                      color='#327bb3'
                    />
                  </div>
                )}

              </div>
            )

          }
        </div>
      </Modal>
    </div>
  )
});

export default EditProductLevel1Modal