CLI_ACCEPT_COOKIE_NAME=(typeof CLI_ACCEPT_COOKIE_NAME!=='undefined'?CLI_ACCEPT_COOKIE_NAME:'viewed_cookie_policy');CLI_PREFERNCE_COOKIE=(typeof CLI_PREFERNCE_COOKIE!=='undefined'?CLI_PREFERNCE_COOKIE:'CookieLawInfoConsent');CLI_ACCEPT_COOKIE_EXPIRE=(typeof CLI_ACCEPT_COOKIE_EXPIRE!=='undefined'?CLI_ACCEPT_COOKIE_EXPIRE:365);CLI_COOKIEBAR_AS_POPUP=(typeof CLI_COOKIEBAR_AS_POPUP!=='undefined'?CLI_COOKIEBAR_AS_POPUP:false);var CLI_Cookie={set:function(name,value,days){if(days){var date=new Date();date.setTime(date.getTime()+(days*24*60*60*1000));var expires="; expires="+date.toGMTString();}else
var expires="";document.cookie=name+"="+value+expires+"; path=/";if(days<1)
{host_name=window.location.hostname;document.cookie=name+"="+value+expires+"; path=/; domain=."+host_name+";";if(host_name.indexOf("www")!=1)
{var host_name_withoutwww=host_name.replace('www','');document.cookie=name+"="+value+expires+"; path=/; domain="+host_name_withoutwww+";";}
host_name=host_name.substring(host_name.lastIndexOf(".",host_name.lastIndexOf(".")-1));document.cookie=name+"="+value+expires+"; path=/; domain="+host_name+";";}},read:function(name){var nameEQ=name+"=";var ca=document.cookie.split(';');for(var i=0;i<ca.length;i++){var c=ca[i];while(c.charAt(0)==' '){c=c.substring(1,c.length);}
if(c.indexOf(nameEQ)===0){return c.substring(nameEQ.length,c.length);}}
return null;},erase:function(name){this.set(name,"",-10);},exists:function(name){return(this.read(name)!==null);},getallcookies:function()
{var pairs=document.cookie.split(";");var cookieslist={};for(var i=0;i<pairs.length;i++){var pair=pairs[i].split("=");cookieslist[(pair[0]+'').trim()]=unescape(pair[1]);}
return cookieslist;}}
var CLI={bar_config:{},showagain_config:{},allowedCategories:[],js_blocking_enabled:false,set:function(args)
{if(typeof JSON.parse!=="function")
{console.log("CookieLawInfo requires JSON.parse but your browser doesn't support it");return;}
if(typeof args.settings!=='object')
{this.settings=JSON.parse(args.settings);}
else
{this.settings=args.settings;}
this.js_blocking_enabled=Boolean(Cli_Data.js_blocking);this.settings=args.settings;this.bar_elm=jQuery(this.settings.notify_div_id);this.showagain_elm=jQuery(this.settings.showagain_div_id);this.settingsModal=jQuery('#cliSettingsPopup');this.main_button=jQuery('.cli-plugin-main-button');this.main_link=jQuery('.cli-plugin-main-link');this.reject_link=jQuery('.cookie_action_close_header_reject');this.delete_link=jQuery(".cookielawinfo-cookie-delete");this.settings_button=jQuery('.cli_settings_button');if(this.settings.cookie_bar_as=='popup')
{CLI_COOKIEBAR_AS_POPUP=true;}
this.addStyleAttribute();this.configBar();this.toggleBar();this.attachDelete();this.attachEvents();this.configButtons();this.reviewConsent();var cli_hidebar_on_readmore=this.hideBarInReadMoreLink();if(Boolean(this.settings.scroll_close)===true&&cli_hidebar_on_readmore===false)
{window.addEventListener("scroll",CLI.closeOnScroll,false);}},hideBarInReadMoreLink:function()
{if(Boolean(CLI.settings.button_2_hidebar)===true&&this.main_link.length>0&&this.main_link.hasClass('cli-minimize-bar'))
{this.hideHeader();cliBlocker.cookieBar(false);this.showagain_elm.slideDown(this.settings.animate_speed_show);return true;}
return false;},attachEvents:function()
{jQuery('.cli_action_button').click(function(e){e.preventDefault();var elm=jQuery(this);var button_action=elm.attr('data-cli_action');var open_link=elm[0].hasAttribute("href")&&elm.attr("href")!='#'?true:false;var new_window=false;if(button_action=='accept')
{CLI.accept_close();new_window=Boolean(CLI.settings.button_1_new_win)?true:false;}else if(button_action=='reject')
{CLI.reject_close();new_window=Boolean(CLI.settings.button_3_new_win)?true:false;}
if(open_link)
{if(new_window)
{window.open(elm.attr("href"),'_blank');}else
{window.location.href=elm.attr("href");}}});this.settingsPopUp();this.settingsTabbedAccordion();this.toggleUserPreferenceCheckBox();this.hideCookieBarOnClose();this.cookieLawInfoRunCallBacks();},toggleUserPreferenceCheckBox:function()
{jQuery('.cli-user-preference-checkbox').each(function(){categoryCookie='cookielawinfo-'+jQuery(this).attr('data-id');categoryCookieValue=CLI_Cookie.read(categoryCookie);if(categoryCookieValue==null)
{if(jQuery(this).is(':checked'))
{CLI_Cookie.set(categoryCookie,'yes',CLI_ACCEPT_COOKIE_EXPIRE);}else
{CLI_Cookie.set(categoryCookie,'no',CLI_ACCEPT_COOKIE_EXPIRE);}}
else
{if(categoryCookieValue=="yes")
{jQuery(this).prop("checked",true);}
else
{jQuery(this).prop("checked",false);}}});jQuery('.cli-user-preference-checkbox').click(function(){var dataID=jQuery(this).attr('data-id');var currentToggleElm=jQuery('.cli-user-preference-checkbox[data-id='+dataID+']');if(jQuery(this).is(':checked'))
{CLI_Cookie.set('cookielawinfo-'+dataID,'yes',CLI_ACCEPT_COOKIE_EXPIRE);currentToggleElm.prop('checked',true);}else
{CLI_Cookie.set('cookielawinfo-'+dataID,'no',CLI_ACCEPT_COOKIE_EXPIRE);currentToggleElm.prop('checked',false);}
CLI.checkCategories();CLI.generateConsent();});},settingsPopUp:function()
{jQuery(document).on('click','.cli_settings_button',function(e){e.preventDefault();CLI.settingsModal.addClass("cli-show").css({'opacity':0}).animate({'opacity':1});CLI.settingsModal.removeClass('cli-blowup cli-out').addClass("cli-blowup");jQuery('body').addClass("cli-modal-open");jQuery(".cli-settings-overlay").addClass("cli-show");jQuery("#cookie-law-info-bar").css({'opacity':.1});if(!jQuery('.cli-settings-mobile').is(':visible'))
{CLI.settingsModal.find('.cli-nav-link:eq(0)').click();}});jQuery('#cliModalClose').click(function(){CLI.settingsPopUpClose();});CLI.settingsModal.click(function(e){if(!(document.getElementsByClassName('cli-modal-dialog')[0].contains(e.target)))
{CLI.settingsPopUpClose();}});jQuery('.cli_enable_all_btn').click(function(){var cli_toggle_btn=jQuery(this);var enable_text=cli_toggle_btn.attr('data-enable-text');var disable_text=cli_toggle_btn.attr('data-disable-text');if(cli_toggle_btn.hasClass('cli-enabled')){CLI.disableAllCookies();cli_toggle_btn.html(enable_text);}
else
{CLI.enableAllCookies();cli_toggle_btn.html(disable_text);}
jQuery(this).toggleClass('cli-enabled');});this.privacyReadmore();},settingsTabbedAccordion:function()
{jQuery(".cli-tab-header").on("click",function(e){if(!(jQuery(e.target).hasClass('cli-slider')||jQuery(e.target).hasClass('cli-user-preference-checkbox')))
{if(jQuery(this).hasClass("cli-tab-active")){jQuery(this).removeClass("cli-tab-active");jQuery(this).siblings(".cli-tab-content").slideUp(200);}else{jQuery(".cli-tab-header").removeClass("cli-tab-active");jQuery(this).addClass("cli-tab-active");jQuery(".cli-tab-content").slideUp(200);jQuery(this).siblings(".cli-tab-content").slideDown(200);}}});},settingsPopUpClose:function()
{this.settingsModal.removeClass('cli-show');this.settingsModal.addClass('cli-out');jQuery('body').removeClass("cli-modal-open");jQuery(".cli-settings-overlay").removeClass("cli-show");jQuery("#cookie-law-info-bar").css({'opacity':1});},privacyReadmore:function()
{var el=jQuery('.cli-privacy-content .cli-privacy-content-text');if(el.length>0){var clone=el.clone(),originalHtml=clone.html(),originalHeight=el.outerHeight(),Trunc={addReadmore:function(textBlock)
{if(textBlock.html().length>250)
{jQuery('.cli-privacy-readmore').show();}
else
{jQuery('.cli-privacy-readmore').hide();}},truncateText:function(textBlock){var strippedText=jQuery('<div />').html(textBlock.html());strippedText.find('table').remove();textBlock.html(strippedText.html());currentText=textBlock.text();if(currentText.trim().length>250){var newStr=currentText.substring(0,250);textBlock.empty().html(newStr).append('...');}},replaceText:function(textBlock,original){return textBlock.html(original);}};Trunc.addReadmore(el);Trunc.truncateText(el);jQuery('a.cli-privacy-readmore').click(function(e){e.preventDefault();if(jQuery('.cli-privacy-overview').hasClass('cli-collapsed'))
{Trunc.truncateText(el);jQuery('.cli-privacy-overview').removeClass('cli-collapsed');el.css('height','100%');}
else
{jQuery('.cli-privacy-overview').addClass('cli-collapsed');Trunc.replaceText(el,originalHtml);}});}},attachDelete:function()
{this.delete_link.click(function(){CLI_Cookie.erase(CLI_ACCEPT_COOKIE_NAME);for(var k in Cli_Data.nn_cookie_ids)
{CLI_Cookie.erase(Cli_Data.nn_cookie_ids[k]);}
CLI.generateConsent();return false;});},configButtons:function()
{this.main_button.css('color',this.settings.button_1_link_colour);if(Boolean(this.settings.button_1_as_button))
{this.main_button.css('background-color',this.settings.button_1_button_colour);this.main_button.hover(function(){jQuery(this).css('background-color',CLI.settings.button_1_button_hover);},function(){jQuery(this).css('background-color',CLI.settings.button_1_button_colour);});}
this.main_link.css('color',this.settings.button_2_link_colour);if(Boolean(this.settings.button_2_as_button))
{this.main_link.css('background-color',this.settings.button_2_button_colour);this.main_link.hover(function(){jQuery(this).css('background-color',CLI.settings.button_2_button_hover);},function(){jQuery(this).css('background-color',CLI.settings.button_2_button_colour);});}
this.reject_link.css('color',this.settings.button_3_link_colour);if(Boolean(this.settings.button_3_as_button))
{this.reject_link.css('background-color',this.settings.button_3_button_colour);this.reject_link.hover(function(){jQuery(this).css('background-color',CLI.settings.button_3_button_hover);},function(){jQuery(this).css('background-color',CLI.settings.button_3_button_colour);});}
this.settings_button.css('color',this.settings.button_4_link_colour);if(Boolean(this.settings.button_4_as_button))
{this.settings_button.css('background-color',this.settings.button_4_button_colour);this.settings_button.hover(function(){jQuery(this).css('background-color',CLI.settings.button_4_button_hover);},function(){jQuery(this).css('background-color',CLI.settings.button_4_button_colour);});}},toggleBar:function()
{if(CLI_COOKIEBAR_AS_POPUP)
{this.barAsPopUp(1);}
if(CLI.settings.cookie_bar_as=='widget')
{this.barAsWidget(1);}
if(!CLI_Cookie.exists(CLI_ACCEPT_COOKIE_NAME))
{this.displayHeader();}else
{this.hideHeader();}
if(Boolean(this.settings.show_once_yn))
{setTimeout(function(){CLI.close_header();},CLI.settings.show_once);}
if(CLI.js_blocking_enabled===false){if(Boolean(Cli_Data.ccpaEnabled)===true){if(Cli_Data.ccpaType==='ccpa'&&Boolean(Cli_Data.ccpaBarEnabled)===false){cliBlocker.cookieBar(false);}}else{jQuery('.wt-cli-ccpa-opt-out,.wt-cli-ccpa-checkbox,.wt-cli-ccpa-element').remove();}}
this.showagain_elm.click(function(e){e.preventDefault();CLI.showagain_elm.slideUp(CLI.settings.animate_speed_hide,function()
{CLI.bar_elm.slideDown(CLI.settings.animate_speed_show);if(CLI_COOKIEBAR_AS_POPUP)
{CLI.showPopupOverlay();}});});},configShowAgain:function()
{this.showagain_config={'background-color':this.settings.background,'color':this.l1hs(this.settings.text),'position':'fixed','font-family':this.settings.font_family};if(Boolean(this.settings.border_on))
{var border_to_hide='border-'+this.settings.notify_position_vertical;this.showagain_config['border']='1px solid '+this.l1hs(this.settings.border);this.showagain_config[border_to_hide]='none';}
var cli_win=jQuery(window);var cli_winw=cli_win.width();var showagain_x_pos=this.settings.showagain_x_position;if(cli_winw<300)
{showagain_x_pos=10;this.showagain_config.width=cli_winw-20;}else
{this.showagain_config.width='auto';}
var cli_defw=cli_winw>400?500:cli_winw-20;if(CLI_COOKIEBAR_AS_POPUP)
{var sa_pos=this.settings.popup_showagain_position;var sa_pos_arr=sa_pos.split('-');if(sa_pos_arr[1]=='left')
{this.showagain_config.left=showagain_x_pos;}else if(sa_pos_arr[1]=='right')
{this.showagain_config.right=showagain_x_pos;}
if(sa_pos_arr[0]=='top')
{this.showagain_config.top=0;}else if(sa_pos_arr[0]=='bottom')
{this.showagain_config.bottom=0;}
this.bar_config['position']='fixed';}else if(this.settings.cookie_bar_as=='widget')
{this.showagain_config.bottom=0;if(this.settings.widget_position=='left')
{this.showagain_config.left=showagain_x_pos;}else if(this.settings.widget_position=='right')
{this.showagain_config.right=showagain_x_pos;}}
else
{if(this.settings.notify_position_vertical=="top")
{this.showagain_config.top='0';}
else if(this.settings.notify_position_vertical=="bottom")
{this.bar_config['position']='fixed';this.bar_config['bottom']='0';this.showagain_config.bottom='0';}
if(this.settings.notify_position_horizontal=="left")
{this.showagain_config.left=showagain_x_pos;}else if(this.settings.notify_position_horizontal=="right")
{this.showagain_config.right=showagain_x_pos;}}
this.showagain_elm.css(this.showagain_config);},configBar:function()
{this.bar_config={'background-color':this.settings.background,'color':this.settings.text,'font-family':this.settings.font_family};if(this.settings.notify_position_vertical=="top")
{this.bar_config['top']='0';if(Boolean(this.settings.header_fix)===true)
{this.bar_config['position']='fixed';}}else
{this.bar_config['bottom']='0';}
this.configShowAgain();this.bar_elm.css(this.bar_config).hide();},l1hs:function(str)
{if(str.charAt(0)=="#"){str=str.substring(1,str.length);}else{return"#"+str;}
return this.l1hs(str);},close_header:function()
{CLI_Cookie.set(CLI_ACCEPT_COOKIE_NAME,'yes',CLI_ACCEPT_COOKIE_EXPIRE);this.hideHeader();},accept_close:function()
{this.hidePopupOverlay();this.generateConsent();this.cookieLawInfoRunCallBacks();CLI_Cookie.set(CLI_ACCEPT_COOKIE_NAME,'yes',CLI_ACCEPT_COOKIE_EXPIRE);if(Boolean(this.settings.notify_animate_hide))
{if(CLI.js_blocking_enabled===true){this.bar_elm.slideUp(this.settings.animate_speed_hide,cliBlocker.runScripts);}else{this.bar_elm.slideUp(this.settings.animate_speed_hide);}}else
{if(CLI.js_blocking_enabled===true){this.bar_elm.hide(cliBlocker.runScripts);}else{this.bar_elm.hide();}}
if(Boolean(this.settings.showagain_tab))
{this.showagain_elm.slideDown(this.settings.animate_speed_show);}
if(Boolean(this.settings.accept_close_reload)===true)
{this.reload_current_page();}
return false;},reject_close:function()
{this.hidePopupOverlay();this.generateConsent();this.cookieLawInfoRunCallBacks();for(var k in Cli_Data.nn_cookie_ids)
{CLI_Cookie.erase(Cli_Data.nn_cookie_ids[k]);}
CLI_Cookie.set(CLI_ACCEPT_COOKIE_NAME,'no',CLI_ACCEPT_COOKIE_EXPIRE);if(Boolean(this.settings.notify_animate_hide))
{if(CLI.js_blocking_enabled===true){this.bar_elm.slideUp(this.settings.animate_speed_hide,cliBlocker.runScripts);}else{this.bar_elm.slideUp(this.settings.animate_speed_hide);}}else
{if(CLI.js_blocking_enabled===true){this.bar_elm.hide(cliBlocker.runScripts);}else{this.bar_elm.hide();}}
if(Boolean(this.settings.showagain_tab))
{this.showagain_elm.slideDown(this.settings.animate_speed_show);}
if(Boolean(this.settings.reject_close_reload)===true)
{this.reload_current_page();}
return false;},reload_current_page:function()
{if(typeof cli_flush_cache!=='undefined'&&cli_flush_cache===true)
{window.location.href=this.add_clear_cache_url_query();}else
{window.location.reload(true);}},add_clear_cache_url_query:function()
{var cli_rand=new Date().getTime()/1000;var cli_url=window.location.href;var cli_hash_arr=cli_url.split('#');var cli_urlparts=cli_hash_arr[0].split('?');if(cli_urlparts.length>=2)
{var cli_url_arr=cli_urlparts[1].split('&');cli_url_temp_arr=new Array();for(var cli_i=0;cli_i<cli_url_arr.length;cli_i++)
{var cli_temp_url_arr=cli_url_arr[cli_i].split('=');if(cli_temp_url_arr[0]=='cli_action')
{}else
{cli_url_temp_arr.push(cli_url_arr[cli_i]);}}
cli_urlparts[1]=cli_url_temp_arr.join('&');cli_url=cli_urlparts.join('?')+(cli_url_temp_arr.length>0?'&':'')+'cli_action=';}else
{cli_url=cli_hash_arr[0]+'?cli_action=';}
cli_url+=cli_rand;if(cli_hash_arr.length>1)
{cli_url+='#'+cli_hash_arr[1];}
return cli_url;},closeOnScroll:function()
{if(window.pageYOffset>100&&!CLI_Cookie.read(CLI_ACCEPT_COOKIE_NAME))
{CLI.accept_close();if(Boolean(CLI.settings.scroll_close_reload)===true)
{window.location.reload();}
window.removeEventListener("scroll",CLI.closeOnScroll,false);}},displayHeader:function()
{if(Boolean(this.settings.notify_animate_show))
{this.bar_elm.slideDown(this.settings.animate_speed_show);}else
{this.bar_elm.show();}
this.showagain_elm.hide();if(CLI_COOKIEBAR_AS_POPUP)
{this.showPopupOverlay();}},hideHeader:function()
{if(Boolean(this.settings.showagain_tab))
{if(Boolean(this.settings.notify_animate_show))
{this.showagain_elm.slideDown(this.settings.animate_speed_show);}else{this.showagain_elm.show();}}else
{this.showagain_elm.hide();}
this.bar_elm.slideUp(this.settings.animate_speed_show);this.hidePopupOverlay();},hidePopupOverlay:function()
{jQuery('body').removeClass("cli-barmodal-open");jQuery(".cli-popupbar-overlay").removeClass("cli-show");},showPopupOverlay:function()
{if(this.bar_elm.length){if(Boolean(this.settings.popup_overlay))
{jQuery('body').addClass("cli-barmodal-open");jQuery(".cli-popupbar-overlay").addClass("cli-show");}}},barAsWidget:function(a)
{var cli_elm=this.bar_elm;cli_elm.attr('data-cli-type','widget');var cli_win=jQuery(window);var cli_winh=cli_win.height()-40;var cli_winw=cli_win.width();var cli_defw=cli_winw>400?300:cli_winw-30;cli_elm.css({'width':cli_defw,'height':'auto','max-height':cli_winh,'overflow':'auto','position':'fixed','box-sizing':'border-box'});if(this.checkifStyleAttributeExist()===false){cli_elm.css({'padding':'25px 15px'});}
if(this.settings.widget_position=='left')
{cli_elm.css({'left':'15px','right':'auto','bottom':'15px','top':'auto'});}else
{cli_elm.css({'left':'auto','right':'15px','bottom':'15px','top':'auto'});}
if(a)
{this.setResize();}},barAsPopUp:function(a)
{if(typeof cookie_law_info_bar_as_popup==='function')
{return false;}
var cli_elm=this.bar_elm;cli_elm.attr('data-cli-type','popup');var cli_win=jQuery(window);var cli_winh=cli_win.height()-40;var cli_winw=cli_win.width();var cli_defw=cli_winw>700?500:cli_winw-20;cli_elm.css({'width':cli_defw,'height':'auto','max-height':cli_winh,'bottom':'','top':'50%','left':'50%','margin-left':(cli_defw/2)*-1,'margin-top':'-100px','overflow':'auto'}).addClass('cli-bar-popup cli-modal-content');if(this.checkifStyleAttributeExist()===false){cli_elm.css({'padding':'25px 15px'});}
cli_h=cli_elm.height();li_h=cli_h<200?200:cli_h;cli_elm.css({'top':'50%','margin-top':((cli_h/2)+30)*-1});setTimeout(function(){cli_elm.css({'bottom':''});},100);if(a)
{this.setResize();}},setResize:function()
{var resizeTmr=null;jQuery(window).resize(function(){clearTimeout(resizeTmr);resizeTmr=setTimeout(function()
{if(CLI_COOKIEBAR_AS_POPUP)
{CLI.barAsPopUp();}
if(CLI.settings.cookie_bar_as=='widget')
{CLI.barAsWidget();}
CLI.configShowAgain();},500);});},enableAllCookies:function()
{jQuery('.cli-user-preference-checkbox').each(function(){var cli_chkbox_elm=jQuery(this);var cli_chkbox_data_id=cli_chkbox_elm.attr('data-id');if(cli_chkbox_data_id!='checkbox-necessary')
{cli_chkbox_elm.prop('checked',true);CLI_Cookie.set('cookielawinfo-'+cli_chkbox_data_id,'yes',CLI_ACCEPT_COOKIE_EXPIRE);}});},hideCookieBarOnClose:function(){jQuery(document).on('click','.cli_cookie_close_button',function(e){e.preventDefault();var elm=jQuery(this);var button_action=elm.attr('data-cli_action');if(Cli_Data.ccpaType==='ccpa')
{CLI.enableAllCookies();}
CLI.accept_close();});},checkCategories:function()
{var cliAllowedCategories=[];var cli_categories={};jQuery('.cli-user-preference-checkbox').each(function()
{var status=false;cli_chkbox_elm=jQuery(this);cli_chkbox_data_id=cli_chkbox_elm.attr('data-id');cli_chkbox_data_id=cli_chkbox_data_id.replace('checkbox-','');cli_chkbox_data_id_trimmed=cli_chkbox_data_id.replace('-','_')
if(jQuery(cli_chkbox_elm).is(':checked'))
{status=true;cliAllowedCategories.push(cli_chkbox_data_id);}
cli_categories[cli_chkbox_data_id_trimmed]=status;});CLI.allowedCategories=cliAllowedCategories;},cookieLawInfoRunCallBacks:function()
{this.checkCategories();if(CLI_Cookie.read(CLI_ACCEPT_COOKIE_NAME)=='yes')
{if("function"==typeof CookieLawInfo_Accept_Callback){CookieLawInfo_Accept_Callback();}}},generateConsent:function()
{var preferenceCookie=CLI_Cookie.read(CLI_PREFERNCE_COOKIE);cliConsent={};if(preferenceCookie!==null){cliConsent=window.atob(preferenceCookie);cliConsent=JSON.parse(cliConsent);}
cliConsent.ver=Cli_Data.consentVersion;categories=[];jQuery('.cli-user-preference-checkbox').each(function(){categoryVal='';cli_chkbox_data_id=jQuery(this).attr('data-id');cli_chkbox_data_id=cli_chkbox_data_id.replace('checkbox-','');if(jQuery(this).is(':checked'))
{categoryVal=true;}
else
{categoryVal=false;}
cliConsent[cli_chkbox_data_id]=categoryVal;});cliConsent=JSON.stringify(cliConsent);cliConsent=window.btoa(cliConsent);CLI_Cookie.set(CLI_PREFERNCE_COOKIE,cliConsent,CLI_ACCEPT_COOKIE_EXPIRE);},addStyleAttribute:function()
{var bar=this.bar_elm;var styleClass='';if(jQuery(bar).find('.cli-bar-container').length>0)
{styleClass=jQuery('.cli-bar-container').attr('class');styleClass=jQuery.trim(styleClass.replace('cli-bar-container',''));jQuery(bar).attr('data-cli-style',styleClass);}},CookieLawInfo_Callback:function(enableBar,enableBlocking){enableBar=typeof enableBar!=='undefined'?enableBar:true;enableBlocking=typeof enableBlocking!=='undefined'?enableBlocking:true;if(CLI.js_blocking_enabled===true&&Boolean(Cli_Data.custom_integration)===true){cliBlocker.cookieBar(enableBar);cliBlocker.runScripts(enableBlocking);}},checkifStyleAttributeExist:function()
{var exist=false;var attr=this.bar_elm.attr('data-cli-style');if(typeof attr!==typeof undefined&&attr!==false){exist=true;}
return exist;},reviewConsent:function()
{jQuery(document).on('click','.cli_manage_current_consent,.wt-cli-manage-consent-link',function(){CLI.displayHeader();});}}
var cliBlocker={blockingStatus:true,scriptsLoaded:false,ccpaEnabled:false,ccpaRegionBased:false,ccpaApplicable:false,ccpaBarEnabled:false,cliShowBar:true,checkPluginStatus:function(callbackA,callbackB)
{this.ccpaEnabled=Boolean(Cli_Data.ccpaEnabled);this.ccpaRegionBased=Boolean(Cli_Data.ccpaRegionBased);this.ccpaBarEnabled=Boolean(Cli_Data.ccpaBarEnabled);if(Boolean(Cli_Data.custom_integration)===true){callbackA(false);}
else{if(this.ccpaEnabled===true){this.ccpaApplicable=true;if(Cli_Data.ccpaType==='ccpa'){if(this.ccpaBarEnabled!==true){this.cliShowBar=false;this.blockingStatus=false;}}}else{jQuery('.wt-cli-ccpa-opt-out,.wt-cli-ccpa-checkbox,.wt-cli-ccpa-element').remove();}
callbackA(this.cliShowBar);callbackB(this.blockingStatus);}},cookieBar:function(showbar)
{showbar=typeof showbar!=='undefined'?showbar:true;cliBlocker.cliShowBar=showbar;if(cliBlocker.cliShowBar===false)
{CLI.bar_elm.hide();CLI.showagain_elm.hide();CLI.settingsModal.removeClass('cli-blowup cli-out');CLI.hidePopupOverlay();jQuery(".cli-settings-overlay").removeClass("cli-show");}
else
{if(!CLI_Cookie.exists(CLI_ACCEPT_COOKIE_NAME))
{CLI.displayHeader();}
else
{CLI.hideHeader();}
CLI.settingsModal.show();jQuery('.cli-modal-backdrop').show();}},runScripts:function(blocking)
{blocking=typeof blocking!=='undefined'?blocking:true;cliBlocker.blockingStatus=blocking;srcReplaceableElms=['iframe','IFRAME','EMBED','embed','OBJECT','object','IMG','img'];var genericFuncs={renderByElement:function()
{cliScriptFuncs.renderScripts();cliBlocker.scriptsLoaded=true;},};var cliScriptFuncs={scriptsDone:function()
{if(typeof Cli_Data.triggerDomRefresh!=='undefined'){if(Boolean(Cli_Data.triggerDomRefresh)===true)
{var DOMContentLoadedEvent=document.createEvent('Event')
DOMContentLoadedEvent.initEvent('DOMContentLoaded',true,true)
window.document.dispatchEvent(DOMContentLoadedEvent);}}},seq:function(arr,callback,index){if(typeof index==='undefined'){index=0}
arr[index](function(){index++
if(index===arr.length){callback()}else{cliScriptFuncs.seq(arr,callback,index)}})},insertScript:function($script,callback){var s='';var scriptType=$script.getAttribute('data-cli-script-type');var elementPosition=$script.getAttribute('data-cli-element-position');var isBlock=$script.getAttribute('data-cli-block');var s=document.createElement('script');var ccpaOptedOut=cliBlocker.ccpaOptedOut();s.type='text/plain';if($script.async)
{s.async=$script.async;}
if($script.defer)
{s.defer=$script.defer;}
if($script.src){s.onload=callback
s.onerror=callback
s.src=$script.src}else{s.textContent=$script.innerText}
var attrs=jQuery($script).prop("attributes");for(var ii=0;ii<attrs.length;++ii){if(attrs[ii].nodeName!=='id'){s.setAttribute(attrs[ii].nodeName,attrs[ii].value);}}
if(cliBlocker.blockingStatus===true)
{if((CLI_Cookie.read(CLI_ACCEPT_COOKIE_NAME)=='yes'&&CLI.allowedCategories.indexOf(scriptType)!==-1))
{s.setAttribute('data-cli-consent','accepted');s.type='text/javascript';}
if(cliBlocker.ccpaApplicable===true){if(ccpaOptedOut===true||CLI_Cookie.read(CLI_ACCEPT_COOKIE_NAME)==null){s.type='text/plain';}}}
else
{s.type='text/javascript';}
if($script.type!=s.type)
{if(elementPosition==='head'){document.head.appendChild(s);}else{document.body.appendChild(s);}
if(!$script.src){callback()}
$script.parentNode.removeChild($script);}
else{callback();}},renderScripts:function()
{var $scripts=document.querySelectorAll('script[data-cli-class="cli-blocker-script"]');if($scripts.length>0)
{var runList=[]
var typeAttr
Array.prototype.forEach.call($scripts,function($script){typeAttr=$script.getAttribute('type')
runList.push(function(callback){cliScriptFuncs.insertScript($script,callback)})})
cliScriptFuncs.seq(runList,cliScriptFuncs.scriptsDone);}}};genericFuncs.renderByElement();},ccpaOptedOut:function(){var ccpaOptedOut=false;var preferenceCookie=CLI_Cookie.read(CLI_PREFERNCE_COOKIE);if(preferenceCookie!==null){cliConsent=window.atob(preferenceCookie);cliConsent=JSON.parse(cliConsent);if(typeof cliConsent.ccpaOptout!=='undefined'){ccpaOptedOut=cliConsent.ccpaOptout;}}
return ccpaOptedOut;}}
jQuery(document).ready(function(){if(typeof cli_cookiebar_settings!='undefined')
{CLI.set({settings:cli_cookiebar_settings});if(CLI.js_blocking_enabled===true){cliBlocker.checkPluginStatus(cliBlocker.cookieBar,cliBlocker.runScripts);}}});
var ewww_webp_supported=!1;function lazysizesWebP(e,t){var a=new Image;a.onload=function(){ewww_webp_supported=0<a.width&&0<a.height,t()},a.onerror=function(){t()},a.src="data:image/webp;base64,"+{alpha:"UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAARBxAR/Q9ERP8DAABWUDggGAAAABQBAJ0BKgEAAQAAAP4AAA3AAP7mtQAAAA==",animation:"UklGRlIAAABXRUJQVlA4WAoAAAASAAAAAAAAAAAAQU5JTQYAAAD/////AABBTk1GJgAAAAAAAAAAAAAAAAAAAGQAAABWUDhMDQAAAC8AAAAQBxAREYiI/gcA"}[e]}function shouldAutoScale(e){if(1==eio_lazy_vars.skip_autoscale)return!1;if(e.hasAttributes())for(var t=e.attributes,a=/skip-autoscale/,i=t.length-1;0<=i;i--){if(a.test(t[i].name))return!1;if(a.test(t[i].value))return!1}return!0}function constrainSrc(e,t,a,i){if(null===e)return e;var r=/w=(\d+)/,n=/fit=(\d+),(\d+)/,o=/resize=(\d+),(\d+)/,s=decodeURIComponent(e);if("undefined"==typeof eio_lazy_vars&&(eio_lazy_vars={exactdn_domain:".exactdn.com"}),0<e.search("\\?")&&0<e.search(eio_lazy_vars.exactdn_domain)){var l=o.exec(s);if(l&&t<l[1])return s.replace(o,"resize="+t+","+a);var c=r.exec(e);if(c&&t<=c[1]){if("bg-cover"!==i&&"img-crop"!==i)return e.replace(r,"w="+t);var d=c[1]-t;return 20<d||a<1080?e.replace(r,"resize="+t+","+a):e}var u=n.exec(s);if(u&&t<u[1]){if("bg-cover"!==i&&"img-crop"!==i)return s.replace(n,"fit="+t+","+a);var f=u[1]-t,A=u[2]-a;return 20<f||20<A?e.replace(r,"resize="+t+","+a):e}if(!c&&!u&&!l)return"img"===i?e+"&fit="+t+","+a:"bg-cover"===i||"img-crop"===i?e+"?resize="+t+","+a:t<a?e+"&h="+a:e+"&w="+t}return-1==e.search("\\?")&&0<e.search(eio_lazy_vars.exactdn_domain)?"img"===i?e+"?fit="+t+","+a:"bg-cover"===i||"img-crop"===i?e+"?resize="+t+","+a:t<a?e+"?h="+a:e+"?w="+t:e}window.lazySizesConfig=window.lazySizesConfig||{},window.lazySizesConfig.init=!1,function(e,t){var a=function(i,A,n){"use strict";var g,h;if(function(){var e,t={lazyClass:"lazyload",loadedClass:"lazyloaded",loadingClass:"lazyloading",preloadClass:"lazypreload",errorClass:"lazyerror",autosizesClass:"lazyautosizes",srcAttr:"data-src",srcsetAttr:"data-srcset",sizesAttr:"data-sizes",minSize:40,customMedia:{},init:!0,expFactor:1.5,hFac:.8,loadMode:2,loadHidden:!0,ricTimeout:0,throttleDelay:125};for(e in h=i.lazySizesConfig||i.lazysizesConfig||{},t)e in h||(h[e]=t[e])}(),!A||!A.getElementsByClassName)return{init:function(){},cfg:h,noSupport:!0};var z=A.documentElement,r=i.HTMLPictureElement,o="addEventListener",v="getAttribute",e=i[o].bind(i),u=i.setTimeout,a=i.requestAnimationFrame||u,s=i.requestIdleCallback,f=/^picture$/i,l=["load","error","lazyincluded","_lazyloaded"],c={},p=Array.prototype.forEach,d=function(e,t){return c[t]||(c[t]=new RegExp("(\\s|^)"+t+"(\\s|$)")),c[t].test(e[v]("class")||"")&&c[t]},m=function(e,t){d(e,t)||e.setAttribute("class",(e[v]("class")||"").trim()+" "+t)},y=function(e,t){var a;(a=d(e,t))&&e.setAttribute("class",(e[v]("class")||"").replace(a," "))},b=function(t,a,e){var i=e?o:"removeEventListener";e&&b(t,a),l.forEach(function(e){t[i](e,a)})},w=function(e,t,a,i,r){var n=A.createEvent("Event");return a||(a={}),a.instance=g,n.initEvent(t,!i,!r),n.detail=a,e.dispatchEvent(n),n},_=function(e,t){var a;!r&&(a=i.picturefill||h.pf)?(t&&t.src&&!e[v]("srcset")&&e.setAttribute("srcset",t.src),a({reevaluate:!0,elements:[e]})):t&&t.src&&(e.src=t.src)},C=function(e,t){return(getComputedStyle(e,null)||{})[t]},E=function(e,t,a){for(a=a||e.offsetWidth;a<h.minSize&&t&&!e._lazysizesWidth;)a=t.offsetWidth,t=t.parentNode;return a},S=(we=[],_e=[],Ce=we,Ee=function(){var e=Ce;for(Ce=we.length?_e:we,be=!(ye=!0);e.length;)e.shift()();ye=!1},Se=function(e,t){ye&&!t?e.apply(this,arguments):(Ce.push(e),be||(be=!0,(A.hidden?u:a)(Ee)))},Se._lsFlush=Ee,Se),t=function(a,e){return e?function(){S(a)}:function(){var e=this,t=arguments;S(function(){a.apply(e,t)})}},x=function(e){var t,a,i=function(){t=null,e()},r=function(){var e=n.now()-a;e<99?u(r,99-e):(s||i)(i)};return function(){a=n.now(),t||(t=u(r,99))}},W=(ee=/^img$/i,te=/^iframe$/i,ae="onscroll"in i&&!/(gle|ing)bot/.test(navigator.userAgent),ie=0,re=0,ne=-1,oe=function(e){re--,(!e||re<0||!e.target)&&(re=0)},se=function(e){return null==$&&($="hidden"==C(A.body,"visibility")),$||!("hidden"==C(e.parentNode,"visibility")&&"hidden"==C(e,"visibility"))},le=function(e,t){var a,i=e,r=se(e);for(I-=t,G+=t,J-=t,O+=t;r&&(i=i.offsetParent)&&i!=A.body&&i!=z;)(r=0<(C(i,"opacity")||1))&&"visible"!=C(i,"overflow")&&(a=i.getBoundingClientRect(),r=O>a.left&&J<a.right&&G>a.top-1&&I<a.bottom+1);return r},ce=function(){var e,t,a,i,r,n,o,s,l,c,d,u,f=g.elements;if((H=h.loadMode)&&re<8&&(e=f.length)){for(t=0,ne++;t<e;t++)if(f[t]&&!f[t]._lazyRace)if(!ae||g.prematureUnveil&&g.prematureUnveil(f[t]))ze(f[t]);else if((s=f[t][v]("data-expand"))&&(n=1*s)||(n=ie),c||(c=!h.expand||h.expand<1?500<z.clientHeight&&500<z.clientWidth?500:370:h.expand,g._defEx=c,d=c*h.expFactor,u=h.hFac,$=null,ie<d&&re<1&&2<ne&&2<H&&!A.hidden?(ie=d,ne=0):ie=1<H&&1<ne&&re<6?c:0),l!==n&&(U=innerWidth+n*u,F=innerHeight+n,o=-1*n,l=n),a=f[t].getBoundingClientRect(),(G=a.bottom)>=o&&(I=a.top)<=F&&(O=a.right)>=o*u&&(J=a.left)<=U&&(G||O||J||I)&&(h.loadHidden||se(f[t]))&&(P&&re<3&&!s&&(H<3||ne<4)||le(f[t],n))){if(ze(f[t]),r=!0,9<re)break}else!r&&P&&!i&&re<4&&ne<4&&2<H&&(k[0]||h.preloadAfterLoad)&&(k[0]||!s&&(G||O||J||I||"auto"!=f[t][v](h.sizesAttr)))&&(i=k[0]||f[t]);i&&!r&&ze(i)}},q=ce,V=0,X=h.throttleDelay,Y=h.ricTimeout,K=function(){j=!1,V=n.now(),q()},Z=s&&49<Y?function(){s(K,{timeout:Y}),Y!==h.ricTimeout&&(Y=h.ricTimeout)}:t(function(){u(K)},!0),de=function(e){var t;(e=!0===e)&&(Y=33),j||(j=!0,(t=X-(n.now()-V))<0&&(t=0),e||t<9?Z():u(Z,t))},ue=function(e){var t=e.target;t._lazyCache?delete t._lazyCache:(oe(e),m(t,h.loadedClass),y(t,h.loadingClass),b(t,Ae),w(t,"lazyloaded"))},fe=t(ue),Ae=function(e){fe({target:e.target})},ge=function(e){var t,a=e[v](h.srcsetAttr);(t=h.customMedia[e[v]("data-media")||e[v]("media")])&&e.setAttribute("media",t),a&&e.setAttribute("srcset",a)},he=t(function(t,e,a,i,r){var n,o,s,l,c,d;(c=w(t,"lazybeforeunveil",e)).defaultPrevented||(i&&(a?m(t,h.autosizesClass):t.setAttribute("sizes",i)),o=t[v](h.srcsetAttr),n=t[v](h.srcAttr),r&&(s=t.parentNode,l=s&&f.test(s.nodeName||"")),d=e.firesLoad||"src"in t&&(o||n||l),c={target:t},m(t,h.loadingClass),d&&(clearTimeout(D),D=u(oe,2500),b(t,Ae,!0)),l&&p.call(s.getElementsByTagName("source"),ge),o?t.setAttribute("srcset",o):n&&!l&&(te.test(t.nodeName)?function(t,a){try{t.contentWindow.location.replace(a)}catch(e){t.src=a}}(t,n):t.src=n),r&&(o||l)&&_(t,{src:n})),t._lazyRace&&delete t._lazyRace,y(t,h.lazyClass),S(function(){var e=t.complete&&1<t.naturalWidth;d&&!e||(e&&m(t,"ls-is-cached"),ue(c),t._lazyCache=!0,u(function(){"_lazyCache"in t&&delete t._lazyCache},9)),"lazy"==t.loading&&re--},!0)}),ze=function(e){if(!e._lazyRace){var t,a=ee.test(e.nodeName),i=a&&(e[v](h.sizesAttr)||e[v]("sizes")),r="auto"==i;(!r&&P||!a||!e[v]("src")&&!e.srcset||e.complete||d(e,h.errorClass)||!d(e,h.lazyClass))&&(t=w(e,"lazyunveilread").detail,r&&M.updateElem(e,!0,e.offsetWidth),e._lazyRace=!0,re++,he(e,t,r,i,a))}},ve=x(function(){h.loadMode=3,de()}),pe=function(){3==h.loadMode&&(h.loadMode=2),ve()},me=function(){P||(n.now()-T<999?u(me,999):(P=!0,h.loadMode=3,de(),e("scroll",pe,!0)))},{_:function(){T=n.now(),g.elements=A.getElementsByClassName(h.lazyClass),k=A.getElementsByClassName(h.lazyClass+" "+h.preloadClass),e("scroll",de,!0),e("resize",de,!0),e("pageshow",function(e){if(e.persisted){var t=A.querySelectorAll("."+h.loadingClass);t.length&&t.forEach&&a(function(){t.forEach(function(e){e.complete&&ze(e)})})}}),i.MutationObserver?new MutationObserver(de).observe(z,{childList:!0,subtree:!0,attributes:!0}):(z[o]("DOMNodeInserted",de,!0),z[o]("DOMAttrModified",de,!0),setInterval(de,999)),e("hashchange",de,!0),["focus","mouseover","click","load","transitionend","animationend"].forEach(function(e){A[o](e,de,!0)}),/d$|^c/.test(A.readyState)?me():(e("load",me),A[o]("DOMContentLoaded",de),u(me,2e4)),g.elements.length?(ce(),S._lsFlush()):de()},checkElems:de,unveil:ze,_aLSL:pe}),M=(R=t(function(e,t,a,i){var r,n,o;if(e._lazysizesWidth=i,i+="px",e.setAttribute("sizes",i),f.test(t.nodeName||""))for(r=t.getElementsByTagName("source"),n=0,o=r.length;n<o;n++)r[n].setAttribute("sizes",i);a.detail.dataAttr||_(e,a.detail)}),L=function(e,t,a){var i,r=e.parentNode;r&&(a=E(e,r,a),(i=w(e,"lazybeforesizes",{width:a,dataAttr:!!t})).defaultPrevented||(a=i.detail.width)&&a!==e._lazysizesWidth&&R(e,r,i,a))},Q=x(function(){var e,t=N.length;if(t)for(e=0;e<t;e++)L(N[e])}),{_:function(){N=A.getElementsByClassName(h.autosizesClass),e("resize",Q)},checkElems:Q,updateElem:L}),B=function(){!B.i&&A.getElementsByClassName&&(B.i=!0,M._(),W._())};var N,R,L,Q;var k,P,D,H,T,U,F,I,J,O,G,$,q,j,V,X,Y,K,Z,ee,te,ae,ie,re,ne,oe,se,le,ce,de,ue,fe,Ae,ge,he,ze,ve,pe,me;var ye,be,we,_e,Ce,Ee,Se;return u(function(){h.init&&B()}),g={cfg:h,autoSizer:M,loader:W,init:B,uP:_,aC:m,rC:y,hC:d,fire:w,gW:E,rAF:S}}(e,e.document,Date);e.lazySizes=a,"object"==typeof module&&module.exports&&(module.exports=a)}("undefined"!=typeof window?window:{}),lazysizesWebP("alpha",lazySizes.init),document.addEventListener("lazybeforesizes",function(e){}),document.addEventListener("lazybeforeunveil",function(e){var t=e.target,a=t.getAttribute("data-srcset");if(t.naturalWidth&&1<t.naturalWidth&&1<t.naturalHeight){var i=window.devicePixelRatio||1,r=t.clientWidth&&1.25*t.clientWidth<t.naturalWidth,n=t.clientHeight&&1.25*t.clientHeight<t.naturalHeight;if(r||n){var o=Math.round(t.offsetWidth*i),s=Math.round(t.offsetHeight*i),l=t.getAttribute("data-src"),c=t.getAttribute("data-src-webp");if(ewww_webp_supported&&c&&-1==l.search("webp=1")&&(l=c),shouldAutoScale(t)&&shouldAutoScale(t.parentNode))if(window.lazySizes.hC(t,"et_pb_jt_filterable_grid_item_image"))d=constrainSrc(l,o,s,"img-crop");else d=constrainSrc(l,o,s,"img");else var d=!1;d&&l!=d&&t.setAttribute("data-src",d)}}if(ewww_webp_supported){if(a){var u=t.getAttribute("data-srcset-webp");u&&t.setAttribute("data-srcset",u)}if(!(c=t.getAttribute("data-src-webp")))return;t.setAttribute("data-src",c)}}),function(e,t){var a=function(){t(e.lazySizes),e.removeEventListener("lazyunveilread",a,!0)};t=t.bind(null,e,e.document),"object"==typeof module&&module.exports?t(require("lazysizes")):e.lazySizes?a():e.addEventListener("lazyunveilread",a,!0)}(window,function(o,e,s){"use strict";var l;e.addEventListener&&(l=/\(|\)|\s|'/,addEventListener("lazybeforeunveil",function(e){var t,a;if(e.detail.instance==s&&(!e.defaultPrevented&&("none"==e.target.preload&&(e.target.preload="auto"),t=e.target.getAttribute("data-bg")))){ewww_webp_supported&&(a=e.target.getAttribute("data-bg-webp"))&&(t=a);var i=o.devicePixelRatio||1,r=Math.round(e.target.offsetWidth*i),n=Math.round(e.target.offsetHeight*i);shouldAutoScale(e.target)&&shouldAutoScale(e.target.parentNode)&&(t=o.lazySizes.hC(e.target,"wp-block-cover")?(o.lazySizes.hC(e.target,"has-parallax")&&(r=Math.round(o.screen.width*i),n=Math.round(o.screen.height*i)),constrainSrc(t,r,n,"bg-cover")):o.lazySizes.hC(e.target,"elementor-bg")?constrainSrc(t,r,n,"bg-cover"):constrainSrc(t,r,n,"bg")),e.target.style.backgroundImage="url("+(l.test(t)?JSON.stringify(t):t)+")"}},!1))});
(function(){var isIe=/(trident|msie)/i.test(navigator.userAgent);if(isIe&&document.getElementById&&window.addEventListener){window.addEventListener('hashchange',function(){var id=location.hash.substring(1),element;if(!(/^[A-z0-9_-]+$/.test(id))){return;}
element=document.getElementById(id);if(element){if(!(/^(?:a|select|input|button|textarea)$/i.test(element.tagName))){element.tabIndex=-1;}
element.focus();}},false);}})();
(function($){var masthead,menuToggle,siteNavContain,siteNavigation;function initMainNavigation(container){var dropdownToggle=$('<button />',{'class':'dropdown-toggle','aria-expanded':false}).append(twentyseventeenScreenReaderText.icon).append($('<span />',{'class':'screen-reader-text',text:twentyseventeenScreenReaderText.expand}));container.find('.menu-item-has-children > a, .page_item_has_children > a').after(dropdownToggle);container.find('.current-menu-ancestor > button').addClass('toggled-on').attr('aria-expanded','true').find('.screen-reader-text').text(twentyseventeenScreenReaderText.collapse);container.find('.current-menu-ancestor > .sub-menu').addClass('toggled-on');container.find('.dropdown-toggle').click(function(e){var _this=$(this),screenReaderSpan=_this.find('.screen-reader-text');e.preventDefault();_this.toggleClass('toggled-on');_this.next('.children, .sub-menu').toggleClass('toggled-on');_this.attr('aria-expanded',_this.attr('aria-expanded')==='false'?'true':'false');screenReaderSpan.text(screenReaderSpan.text()===twentyseventeenScreenReaderText.expand?twentyseventeenScreenReaderText.collapse:twentyseventeenScreenReaderText.expand);});}
initMainNavigation($('.main-navigation'));masthead=$('#masthead');menuToggle=masthead.find('.menu-toggle');siteNavContain=masthead.find('.main-navigation');siteNavigation=masthead.find('.main-navigation > div > ul');(function(){if(!menuToggle.length){return;}
menuToggle.attr('aria-expanded','false');menuToggle.on('click.twentyseventeen',function(){siteNavContain.toggleClass('toggled-on');$(this).attr('aria-expanded',siteNavContain.hasClass('toggled-on'));});})();(function(){if(!siteNavigation.length||!siteNavigation.children().length){return;}
function toggleFocusClassTouchScreen(){if('none'===$('.menu-toggle').css('display')){$(document.body).on('touchstart.twentyseventeen',function(e){if(!$(e.target).closest('.main-navigation li').length){$('.main-navigation li').removeClass('focus');}});siteNavigation.find('.menu-item-has-children > a, .page_item_has_children > a').on('touchstart.twentyseventeen',function(e){var el=$(this).parent('li');if(!el.hasClass('focus')){e.preventDefault();el.toggleClass('focus');el.siblings('.focus').removeClass('focus');}});}else{siteNavigation.find('.menu-item-has-children > a, .page_item_has_children > a').unbind('touchstart.twentyseventeen');}}
if('ontouchstart'in window){$(window).on('resize.twentyseventeen',toggleFocusClassTouchScreen);toggleFocusClassTouchScreen();}
siteNavigation.find('a').on('focus.twentyseventeen blur.twentyseventeen',function(){$(this).parents('.menu-item, .page_item').toggleClass('focus');});})();})(jQuery);
(function($){var $body=$('body'),$customHeader=$body.find('.custom-header'),$branding=$customHeader.find('.site-branding'),$navigation=$body.find('.navigation-top'),$navWrap=$navigation.find('.wrap'),$navMenuItem=$navigation.find('.menu-item'),$menuToggle=$navigation.find('.menu-toggle'),$menuScrollDown=$body.find('.menu-scroll-down'),$sidebar=$body.find('#secondary'),$entryContent=$body.find('.entry-content'),$formatQuote=$body.find('.format-quote blockquote'),isFrontPage=$body.hasClass('twentyseventeen-front-page')||$body.hasClass('home blog'),navigationFixedClass='site-navigation-fixed',navigationHeight,navigationOuterHeight,navPadding,navMenuItemHeight,idealNavHeight,navIsNotTooTall,headerOffset,menuTop=0,resizeTimer;$('a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex], [contenteditable]','.site-content-contain').filter(':visible').focus(function(){if($navigation.hasClass('site-navigation-fixed')){var windowScrollTop=$(window).scrollTop(),fixedNavHeight=$navigation.height(),itemScrollTop=$(this).offset().top,offsetDiff=itemScrollTop-windowScrollTop;if($('#wpadminbar').length){offsetDiff-=$('#wpadminbar').height();}
if(offsetDiff<fixedNavHeight){$(window).scrollTo(itemScrollTop-(fixedNavHeight+50),0);}}});function setNavProps(){navigationHeight=$navigation.height();navigationOuterHeight=$navigation.outerHeight();navPadding=parseFloat($navWrap.css('padding-top'))*2;navMenuItemHeight=$navMenuItem.outerHeight()*2;idealNavHeight=navPadding+navMenuItemHeight;navIsNotTooTall=navigationHeight<=idealNavHeight;}
function adjustScrollClass(){if('none'===$menuToggle.css('display')){if(navIsNotTooTall){if(isFrontPage&&($body.hasClass('has-header-image')||$body.hasClass('has-header-video'))){headerOffset=$customHeader.innerHeight()-navigationOuterHeight;}else{headerOffset=$customHeader.innerHeight();}
if($(window).scrollTop()>=headerOffset){$navigation.addClass(navigationFixedClass);}else{$navigation.removeClass(navigationFixedClass);}}else{$navigation.removeClass(navigationFixedClass);}}}
function adjustHeaderHeight(){if('none'===$menuToggle.css('display')){if(isFrontPage){$branding.css('margin-bottom',navigationOuterHeight);}else{$customHeader.css('margin-bottom',navigationOuterHeight);}}else{$customHeader.css('margin-bottom','0');$branding.css('margin-bottom','0');}}
function setQuotesIcon(){$(twentyseventeenScreenReaderText.quote).prependTo($formatQuote);}
function belowEntryMetaClass(param){var sidebarPos,sidebarPosBottom;if(!$body.hasClass('has-sidebar')||($body.hasClass('search')||$body.hasClass('single-attachment')||$body.hasClass('error404')||$body.hasClass('twentyseventeen-front-page'))){return;}
sidebarPos=$sidebar.offset();sidebarPosBottom=sidebarPos.top+($sidebar.height()+28);$entryContent.find(param).each(function(){var $element=$(this),elementPos=$element.offset(),elementPosTop=elementPos.top;if(elementPosTop>sidebarPosBottom){$element.addClass('below-entry-meta');}else{$element.removeClass('below-entry-meta');}});}
function supportsInlineSVG(){var div=document.createElement('div');div.innerHTML='<svg/>';return'http://www.w3.org/2000/svg'===('undefined'!==typeof SVGRect&&div.firstChild&&div.firstChild.namespaceURI);}
function checkiOS(){return/iPad|iPhone|iPod/.test(navigator.userAgent)&&!window.MSStream;}
function supportsFixedBackground(){var el=document.createElement('div'),isSupported;try{if(!('backgroundAttachment'in el.style)||checkiOS()){return false;}
el.style.backgroundAttachment='fixed';isSupported=('fixed'===el.style.backgroundAttachment);return isSupported;}
catch(e){return false;}}
$(document).ready(function(){if($navigation.length){setNavProps();adjustScrollClass();}
if($menuScrollDown.length){if($('body').hasClass('admin-bar')){menuTop-=32;}
if($('body').hasClass('blog')){menuTop-=30;}
if(!$navigation.length){navigationOuterHeight=0;}
$menuScrollDown.click(function(e){e.preventDefault();$(window).scrollTo('#primary',{duration:600,offset:{top:menuTop-navigationOuterHeight}});});}
adjustHeaderHeight();setQuotesIcon();belowEntryMetaClass('blockquote.alignleft, blockquote.alignright');if(true===supportsInlineSVG()){document.documentElement.className=document.documentElement.className.replace(/(\s*)no-svg(\s*)/,'$1svg$2');}
if(true===supportsFixedBackground()){document.documentElement.className+=' background-fixed';}});if($navigation.length){$(window).on('scroll',function(){adjustScrollClass();adjustHeaderHeight();});$(window).resize(function(){setNavProps();setTimeout(adjustScrollClass,500);});}
$(window).resize(function(){clearTimeout(resizeTimer);resizeTimer=setTimeout(function(){belowEntryMetaClass('blockquote.alignleft, blockquote.alignright');},300);setTimeout(adjustHeaderHeight,1000);});$(document).on('wp-custom-header-video-loaded',function(){$body.addClass('has-header-video');});})(jQuery);
;
/*!
 * jQuery.scrollTo
 * Copyright (c) 2007-2015 Ariel Flesler - aflesler<a>gmail<d>com | http://flesler.blogspot.com
 * Licensed under MIT
 * http://flesler.blogspot.com/2007/10/jqueryscrollto.html
 * @projectDescription Lightweight, cross-browser and highly customizable animated scrolling with jQuery
 * @author Ariel Flesler
 * @version 2.1.2
 */
(function(factory){'use strict';if(typeof define==='function'&&define.amd){define(['jquery'],factory);}else if(typeof module!=='undefined'&&module.exports){module.exports=factory(require('jquery'));}else{factory(jQuery);}})(function($){'use strict';var $scrollTo=$.scrollTo=function(target,duration,settings){return $(window).scrollTo(target,duration,settings);};$scrollTo.defaults={axis:'xy',duration:0,limit:true};function isWin(elem){return!elem.nodeName||$.inArray(elem.nodeName.toLowerCase(),['iframe','#document','html','body'])!==-1;}
$.fn.scrollTo=function(target,duration,settings){if(typeof duration==='object'){settings=duration;duration=0;}
if(typeof settings==='function'){settings={onAfter:settings};}
if(target==='max'){target=9e9;}
settings=$.extend({},$scrollTo.defaults,settings);duration=duration||settings.duration;var queue=settings.queue&&settings.axis.length>1;if(queue){duration/=2;}
settings.offset=both(settings.offset);settings.over=both(settings.over);return this.each(function(){if(target===null){return;}
var win=isWin(this),elem=win?this.contentWindow||window:this,$elem=$(elem),targ=target,attr={},toff;switch(typeof targ){case'number':case'string':if(/^([+-]=?)?\d+(\.\d+)?(px|%)?$/.test(targ)){targ=both(targ);break;}
targ=win?$(targ):$(targ,elem);case'object':if(targ.length===0){return;}
if(targ.is||targ.style){toff=(targ=$(targ)).offset();}}
var offset=$.isFunction(settings.offset)&&settings.offset(elem,targ)||settings.offset;$.each(settings.axis.split(''),function(i,axis){var Pos=axis==='x'?'Left':'Top',pos=Pos.toLowerCase(),key='scroll'+Pos,prev=$elem[key](),max=$scrollTo.max(elem,axis);if(toff){attr[key]=toff[pos]+(win?0:prev-$elem.offset()[pos]);if(settings.margin){attr[key]-=parseInt(targ.css('margin'+Pos),10)||0;attr[key]-=parseInt(targ.css('border'+Pos+'Width'),10)||0;}
attr[key]+=offset[pos]||0;if(settings.over[pos]){attr[key]+=targ[axis==='x'?'width':'height']()*settings.over[pos];}}else{var val=targ[pos];attr[key]=val.slice&&val.slice(-1)==='%'?parseFloat(val)/100*max:val;}
if(settings.limit&&/^\d+$/.test(attr[key])){attr[key]=attr[key]<=0?0:Math.min(attr[key],max);}
if(!i&&settings.axis.length>1){if(prev===attr[key]){attr={};}else if(queue){animate(settings.onAfterFirst);attr={};}}});animate(settings.onAfter);function animate(callback){var opts=$.extend({},settings,{queue:true,duration:duration,complete:callback&&function(){callback.call(elem,targ,settings);}});$elem.animate(attr,opts);}});};$scrollTo.max=function(elem,axis){var Dim=axis==='x'?'Width':'Height',scroll='scroll'+Dim;if(!isWin(elem)){return elem[scroll]-$(elem)[Dim.toLowerCase()]();}
var size='client'+Dim,doc=elem.ownerDocument||elem.document,html=doc.documentElement,body=doc.body;return Math.max(html[scroll],body[scroll])-Math.min(html[size],body[size]);};function both(val){return $.isFunction(val)||$.isPlainObject(val)?val:{top:val,left:val};}
$.Tween.propHooks.scrollLeft=$.Tween.propHooks.scrollTop={get:function(t){return $(t.elem)[t.prop]();},set:function(t){var curr=this.get(t);if(t.options.interrupt&&t._last&&t._last!==curr){return $(t.elem).stop();}
var next=Math.round(t.now);if(curr!==next){$(t.elem)[t.prop](next);t._last=this.get(t);}}};return $scrollTo;});