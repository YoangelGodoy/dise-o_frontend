import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';

import { AppSidebarNav } from './AppSidebarNav';
import '../scss/_custom.scss'
// sidebar nav config
import navigation from '../_nav';

const AppSidebar = () => {
  const dispatch = useDispatch();
  const unfoldable = useSelector((state) => state.sidebarUnfoldable);
  const sidebarShow = useSelector((state) => state.sidebarShow);

  return (
    <CSidebar
      className="bg-primary"
      colorScheme="dark"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible });
      }}
    >
      <CSidebarHeader style={{display: "flex", alignItems: "center", justifyContent: "left", textAlign: "center", paddingTop:"10px", paddingBottom:"2px"}} >
      <div className="border-bottom-logo" style={{paddingBottom:"10px", paddingTop:"12px", display: "flex", alignItems: "center", justifyContent: "left", textAlign: "center"}}>
      <h5>Prefectura Michelena</h5>  
      </div>  
      </CSidebarHeader>
      <AppSidebarNav items={navigation} />
      <CSidebarFooter className=" d-none d-lg-flex">
      <div className="border-top-logo" style={{paddingBottom:"1px", paddingTop:"15px", display: "flex", alignItems: "center", justifyContent: "left", textAlign: "center"}}>
      <CSidebarToggler
          onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
        />
      </div>
      </CSidebarFooter>
    </CSidebar>
  );
};

export default React.memo(AppSidebar);